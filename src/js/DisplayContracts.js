import React from 'react'
import DisplayDetailContracts from './DisplayDetailContracts'
import DisplayState from './DisplayState'

class DisplayContracts extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: false,
            account: '0x0',
            leases: [],
            displayDetails: []
        };

        this.handleClick = this.handleClick.bind(this);
        this.loadLeases = this.loadLeases.bind(this);
        this.loadLeaseByIndex = this.loadLeaseByIndex.bind(this);
        this.watchEvents = this.watchEvents.bind(this);
    }

    handleClick(i, event) {
        const newDisplayDetails = [...this.state.displayDetails]
        newDisplayDetails[i] = !newDisplayDetails[i]
        this.setState({
            displayDetails: newDisplayDetails
        })
    }

    componentDidMount() {
        this.props.web3.eth.getCoinbase((err, account) => {
            this.setState({
                account: account
            })
            this.props.leasesContract.deployed().then((smartLeaseInstance) => {
                this.smartLeaseInstance = smartLeaseInstance
                this.loadLeases()
                this.watchEvents()
            })
        })
    }

    loadLeases() {
        this.smartLeaseInstance.leasesCount().then((leasesCount) => {
            this.tempTab = [...this.state.leases]
            for (var i = 0; i < leasesCount; i++) {
                this.loadLeaseByIndex(i, false)
            }
            this.setState({
                leases: this.tempTab
            })
        })
    }

    loadLeaseByIndex(_index, _callFromEvent) {
        this.smartLeaseInstance.leases(_index).then((lease) => {
            this.smartLeaseInstance.leasesDetails(_index).then((leaseDetails) => {
                if (lease[this.props.categoryToFetch] === this.state.account) {
                    var temp = {
                        landlord: lease[0],
                        tenant: lease[1],
                        litigator: lease[2],
                        physicalAddress: lease[3],
                        hashId: lease[4],
                        state: lease[5],
                        signature: lease[6],
                        key: lease[7],
                        rentPerMonth: leaseDetails[0],
                        depositToPay: leaseDetails[1],
                        depositPaid: leaseDetails[2],
                        totalRentToPay: leaseDetails[3],
                        rentPaid: leaseDetails[4],
                        durationInMonth: leaseDetails[5],
                        balanceToBeWithdrawn: leaseDetails[6]
                    }
                    this.tempTab[_index] = temp
                    if (_callFromEvent) {
                        this.setState({
                            leases: this.tempTab
                        })
                    }
                    this.setState({
                        loading: true
                    })
                }
            })
        })
    }

    render() {
        let displayState 
        return this.state.leases.map((lease) => {
            displayState = ( 
                <div>
                    <br/>
                    <div className = "leases" >
                        <br/>
                            <table onClick={this.handleClick.bind(this, lease.key)} >
                                <thead>
                                    <tr  >
                                        <th> Contract ID: {lease.key.toString() } </th>
                                        <th > {lease.physicalAddress} </th>
                                        <DisplayState 
                                          lease={lease}
                                          index={lease.key} />
                                    </tr>
                                </thead>
                            </table>
                        <br/>
                    </div>
                </div>  
            )
            if (!this.state.displayDetails[lease.key]) {
                return (
                    <div key={lease.key}>
                        {displayState}
                    </div>
                )
            }
            else {
                return (
                    <div key={lease.key}>
                        {displayState}
                        <DisplayDetailContracts className="leasesDetails"
                              account={this.state.account}
                              leasesContract={this.props.leasesContract}
                              lease={lease}
                              type={this.props.type} 
                              index={lease.key} /> 
                    </div>
                )
            }                       
        })   
    }

    watchEvents() {
        this.smartLeaseInstance.leaseSignedEvent({}, {
            fromBlock: 'latest'
        }).watch((error, event) => {
            console.log("Lease signed -- re-fetch lease");
            this.loadLeaseByIndex(event.args.index, true)
        })
        this.smartLeaseInstance.depositFullEvent({}, {
            fromBlock: 'latest'
        }).watch((error, event) => {
            console.log("Deposit paid -- re-fetch lease");
            this.loadLeaseByIndex(event.args.index, true)
        })
        this.smartLeaseInstance.leaseCreatedEvent({}, {
            fromBlock: 'latest'
        }).watch((error, event) => {
            console.log("Lease created -- load lease");
            this.loadLeaseByIndex(event.args.index, true)
        })
        this.smartLeaseInstance.rentPaidMonth({}, {
            fromBlock: 'latest'
        }).watch((error, event) => {
            console.log("Rent paid -- reload lease");
            this.loadLeaseByIndex(event.args.index, true)
        })
        this.smartLeaseInstance.rentWithdrawn({}, {
            fromBlock: 'latest'
        }).watch((error, event) => {
            console.log("Rent withdrwawn -- reload lease");
            this.loadLeaseByIndex(event.args.index, true)
        })
        this.smartLeaseInstance.depositWithdrawn({}, {
            fromBlock: 'latest'
        }).watch((error, event) => {
            console.log("deposit withdrawn -- reload lease");
            this.loadLeaseByIndex(event.args.index, true)
        })
    }
}

export default DisplayContracts