import React from 'react'
import DisplayDetailContracts from './DisplayDetailContracts'
import DisplayState from './DisplayState'

/** @
  * @ Display List of Contracts
  * @ type of owner given by DisplayTabs
  * @ 
  * @ 
  */
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

    // Handle show/hide lease details
    handleClick(i, event) {
        const newDisplayDetails = [...this.state.displayDetails]
        newDisplayDetails[i] = !newDisplayDetails[i]
        this.setState({
            displayDetails: newDisplayDetails
        })
    }

    // Load account, watch events and load leases in state when component mounts
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

    // load leases in state
    loadLeases() {
        // get the number of leases stored in blockchain
        this.smartLeaseInstance.leasesCount().then((leasesCount) => {
            // initialize temporary lease table by copying existing state ones
            this.tempTab = [...this.state.leases]
            // load lease one by one 
            for (var i = 0; i < leasesCount; i++) {
                this.loadLeaseByIndex(i, false)
            }
            // set the full table in state after all are loaded -- for performances & unmounted access errors
            this.setState({
                leases: this.tempTab
            })
        })
    }

    loadLeaseByIndex(_index, _callFromEvent) {
        // for each lease, get the lease general information & detail information (through index)
        this.smartLeaseInstance.leases(_index).then((lease) => {
            this.smartLeaseInstance.leasesDetails(_index).then((leaseDetails) => {
                // store in state only the leases matching the category (tenant landlord litigator - given by mother component)
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
                    // store the information from the blockchain in a temporary table 
                    this.tempTab[_index] = temp
                    // if the call is from an event, we can setState directly, as there is only one call to loadLeaseByIndex directly
                    if (_callFromEvent) {
                        this.setState({
                            leases: this.tempTab
                        })
                    }
                    // modify state of simple variable to re render and activate store of leases in state
                    this.setState({
                        loading: true
                    })
                }
            })
        })
    }

    render() {
        // Display general information, or general information + detail if needed
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
            // case we display only general information
            if (!this.state.displayDetails[lease.key]) {
                return (
                    <div key={lease.key}>
                        {displayState}
                    </div>
                )
            }
            // case we display detailed information as well
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