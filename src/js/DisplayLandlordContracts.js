import React from 'react'
import DisplayDetailContracts from './DisplayDetailContracts'
import DisplayState from './DisplayState'

class DisplayLandlordContracts extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      leases: [],
      leasesCount:0,
      lastLoaded:0,
      displayDetails: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.loadLeases = this.loadLeases.bind(this);
    this.loadLeaseByIndex = this.loadLeaseByIndex.bind(this);
  }

  handleClick(i, event) {
    const newDisplayDetails = [...this.state.displayDetails]
    newDisplayDetails[i] = !newDisplayDetails[i] 
    this.setState({ displayDetails: newDisplayDetails })
  }

  componentDidMount() {
    this.props.leasesContract.deployed().then((smartLeaseInstance) => {
      this.smartLeaseInstance = smartLeaseInstance
      this.loadLeases()
    })
  }

  loadLeases() {
    this.smartLeaseInstance.leasesCount().then((leasesCount) => {
      this.setState({leasesCount : leasesCount})
      this.setState({leases: []})
      for (var i = 0; i < leasesCount ; i++) {
        this.loadLeaseByIndex(i)
      }
    }) 
  }

  loadLeaseByIndex(_index) {
      this.smartLeaseInstance.leases(_index).then((lease) => {

      this.lease = lease 
      this.smartLeaseInstance.leasesDetails(_index).then((leaseDetails) => {
        this.leaseDetails = leaseDetails

        var leasesLandlord = [...this.state.leases]
        if (lease[0] === this.props.account ) {

          const leasesLandlord = [...this.state.leases]
          leasesLandlord.push({
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
          })
          this.setState({ leases: leasesLandlord })
        }
      })       
      this.setState({ lastLoaded : _index })
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
                        index={lease.key}
                        signLease={this.props.signLease}
                        payDeposit={this.props.payDeposit} />
                    </tr>
                  </thead>
                </table>
                <br/>
              </div>
            </div>  )

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
                        account={this.props.account}
                        leasesContract={this.props.leasesContract}
                        lease={lease}
                        type={this.props.type} 
                        signLease={this.props.signLease}
                        payDeposit={this.props.payDeposit}
                        index={lease.key}
                        payRent={this.props.payRent}
                        withdrawRent={this.props.withdrawRent}
                        withdrawDeposit={this.props.withdrawDeposit} /> 
                </div>
                  )
              }
                                
        })   
  }

}

export default DisplayLandlordContracts
