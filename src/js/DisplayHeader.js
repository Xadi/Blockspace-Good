import React from 'react'

class DisplayHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accountBalance:0,
      leasesCount: 0,
      ethBalance: 0
    };

    this.updateCount = this.updateCount.bind(this)
    this.updateMoneyInSmartContract = this.updateMoneyInSmartContract.bind(this)
    this.getBalanceAccount = this.getBalanceAccount.bind(this)
  }

  componentDidMount() {
    this.props.leasesContract.deployed().then((smartLeaseInstance) => {
      this.smartLeaseInstance = smartLeaseInstance
      this.updateMoneyInSmartContract()
      this.getBalanceAccount()
      this.updateCount()
    })
  }

  updateMoneyInSmartContract () {
    this.web3.eth.getBalance(this.smartLeaseInstance.address, (err, result) => {        
      var balance = web3.fromWei(result, "ether")
      this.setState({ ethBalance : balance })
    })
  }

  getBalanceAccount () {
    this.web3.eth.getBalance(this.state.account, (err, result) => {        
      var balance = web3.fromWei(result, "ether")
      this.setState({ accountBalance : balance })
    })
  }

  updateCount() {
    this.smartLeaseInstance.leasesCount().then((leasesCount) => {
      this.setState({leasesCount : leasesCount})
    }) 
  }

  render() {
          return(

            <div className='row'>
             <div className='col-lg-12 text-center' >
          <h1>Blockspace x Capeo</h1>
          <br/>
          <table>
            <tbody>
              <tr>
                <td> Total Number of Leases handled by Blockspace: {this.state.leasesCount.toString() } </td>
                <td> Smart Contract balance: {this.state.ethBalance.toString()} ETH </td>
              </tr>
            </tbody>
          </table>
          </div>
          </div>
      )
    }
 

}

export default DisplayHeader