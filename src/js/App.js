import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Leases from '../../build/contracts/Leases.json'
import DisplayTabs from './DisplayTabs'
import DisplayHeader from './DisplayHeader'
import 'bootstrap/dist/css/bootstrap.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      accountBalance:0,
      leasesCount: 0,
      leasesLandlord: [],
      leasesTenant: [],
      leasesLitigator: [],
      lastLoaded: 0,
      ethBalance:0,
      loading:false,
    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.leasesContract = TruffleContract(Leases)
    this.leasesContract.setProvider(this.web3Provider)

    this.watchEvents = this.watchEvents.bind(this)



  }



  componentDidMount() {
    this.setState({loading: true})
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.leasesContract.deployed().then((smartLeaseInstance) => {
        this.smartLeaseInstance = smartLeaseInstance
        this.watchEvents()
      })
    }) 
  }

  

  watchEvents() {
    this.smartLeaseInstance.leaseSignedEvent({}, {
      fromBlock: 'latest'
    }).watch((error, event) => {
      console.log(this.state.loading)
        if (!this.state.loading) {
        console.log(event);
        this.loadLeases()
        this.getBalanceAccount()
      }
    })

    this.smartLeaseInstance.depositFullEvent({}, {
      fromBlock: 'latest'
    }).watch((error, event) => {
      if (!this.state.loading) {
        console.log(event);
        this.loadLeases()
        this.updateMoneyInSmartContract()
        this.getBalanceAccount()
      }
    })

    this.smartLeaseInstance.leaseCreatedEvent({}, {
      fromBlock: 'latest'
    }).watch((error, event) => {
      if ( (event.args.index > this.state.lastLoaded) ) {
        console.log(event);
        this.loadLeaseByIndex(event.args.index)
        this.updateCount()
        this.getBalanceAccount()
      }
    })

    this.smartLeaseInstance.rentPaidMonth({}, {
      fromBlock: 'latest'
    }).watch((error, event) => {
      if (!this.state.loading) {
        console.log(event);
        this.loadLeases()
        this.getBalanceAccount()
        this.updateMoneyInSmartContract()
      }
    })

    this.smartLeaseInstance.rentWithdrawn({}, {
      fromBlock: 'latest'
    }).watch((error, event) => {
      if (!this.state.loading) {
        console.log(event);
        this.loadLeases()
        this.getBalanceAccount()
        this.updateMoneyInSmartContract()
      }
    })

    this.smartLeaseInstance.depositWithdrawn({}, {
      fromBlock: 'latest'
    }).watch((error, event) => {
      if (!this.state.loading) {
        console.log(event); 
        this.loadLeases()
        this.getBalanceAccount()
        this.updateMoneyInSmartContract()
      }
    })
  }

  



  render() {
    return (
      <div>

              <DisplayHeader 
                leasesContract={this.leasesContract}
                account={this.state.account}
                web3={this.web3} />
        
              <DisplayTabs 
                leasesContract={this.leasesContract}
                account={this.state.account} 
                accountBalance={this.state.accountBalance}
                leasesLandlord={this.state.leasesLandlord} 
                leasesTenant={this.state.leasesTenant}
                leasesLitigator={this.state.leasesLitigator}
                signLease={this.signLease}
                payDeposit={this.payDeposit}
                payRent={this.payRent}
                withdrawRent={this.withdrawRent}
                withdrawDeposit={this.withdrawDeposit} />

      </div>
    )
  }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
