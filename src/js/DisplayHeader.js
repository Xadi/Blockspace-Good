import React from 'react'

/** @
  * @ Display Header infromation
  * @ smart contract balances, account and balance account
  * @ 
  */
class DisplayHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            accountBalance: 0,
            leasesCount: 0,
            ethBalance: 0
        };

        this.updateCount = this.updateCount.bind(this)
        this.updateMoneyInSmartContract = this.updateMoneyInSmartContract.bind(this)
        this.getBalanceAccount = this.getBalanceAccount.bind(this)
        this.watchEvents = this.watchEvents.bind(this)
    }

    // on component load
    componentDidMount() {
        this.props.web3.eth.getCoinbase((err, account) => {
            this.setState({
                account: account
            })
            // load balances and watch events
            this.props.leasesContract.deployed().then((smartLeaseInstance) => {
                this.smartLeaseInstance = smartLeaseInstance
                this.updateMoneyInSmartContract()
                this.getBalanceAccount()
                this.updateCount()
                this.watchEvents()
            })
        })
    }

    updateMoneyInSmartContract() {
        this.props.web3.eth.getBalance(this.smartLeaseInstance.address, (err, result) => {
            var balance = web3.fromWei(result, "ether")
            this.setState({
                ethBalance: balance
            })
        })
    }

    getBalanceAccount() {
        this.props.web3.eth.getBalance(this.state.account, (err, result) => {
            var balance = web3.fromWei(result, "ether")
            this.setState({
                accountBalance: balance
            })
        })
    }

    updateCount() {
        this.smartLeaseInstance.leasesCount().then((leasesCount) => {
            this.setState({
                leasesCount: leasesCount
            })
        })
    }

    render() {
        return(
            <div>
                <h1>Blockspace x Capeo</h1>
                <br/>
                <table>
                    <tbody>
                        <tr>
                            <td> Total Number of Leases handled by Blockspace: {this.state.leasesCount.toString() } </td>
                            <td> Smart Contract balance: {this.state.ethBalance.toString()} ETH </td>
                        </tr>
                        <tr>
                            <th> Your account: {this.state.account} </th>
                            <th> Your balance: {this.state.accountBalance.toString()} ETH </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }


    watchEvents() {
        this.leaseSignedEvent = this.smartLeaseInstance.leaseSignedEvent({}, {
            fromBlock: 'latest',
            toBlock: 'pending'
        }).watch((error, event) => {
            console.log("Lease Signed -- update Header")
            this.getBalanceAccount()
        })
        this.depositEvent = this.smartLeaseInstance.depositFullEvent({}, {
            fromBlock: 'latest',
            toBlock: 'pending'
        }).watch((error, event) => {
            console.log("Deposit done -- update Header");
            this.updateMoneyInSmartContract()
            this.getBalanceAccount()
        })
        this.leaseCreatedEvent = this.smartLeaseInstance.leaseCreatedEvent({}, {
            fromBlock: 'latest',
            toBlock: 'pending'
        }).watch((error, event) => {
            console.log("Lease Created -- update Header");
            this.updateCount()
            this.getBalanceAccount()
        })
        this.rentPaidEvent = this.smartLeaseInstance.rentPaidMonth({}, {
            fromBlock: 'latest',
            toBlock: 'pending'
        }).watch((error, event) => {
            console.log("Rent paid -- update Header");
            this.getBalanceAccount()
            this.updateMoneyInSmartContract()
        })
        this.rentWithdrawnEvent = this.smartLeaseInstance.rentWithdrawn({}, {
            fromBlock: 'latest',
            toBlock: 'pending'
        }).watch((error, event) => {
            console.log("Rent withdrawn done -- update Header");
            this.getBalanceAccount()
            this.updateMoneyInSmartContract()
        })
        this.depositWithdrawnEvent = this.smartLeaseInstance.depositWithdrawn({}, {
            fromBlock: 'latest',
            toBlock: 'pending'
        }).watch((error, event) => {
            console.log("Deposit withdrawn -- update Header");
            this.getBalanceAccount()
            this.updateMoneyInSmartContract()
        })
    }
}

export default DisplayHeader