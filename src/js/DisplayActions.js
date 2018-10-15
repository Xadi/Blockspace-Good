import React from 'react'

/** @
  * @ Display Actions component
  * @ switch on owner (litigator - tenant - landlord) to display 
  * @ actions (pay rent, sign...)
  * @ 
  */
class DisplayActions extends React.Component {

    constructor(props) {
        super(props);

        this.handleSignLease = this.handleSignLease.bind(this);
        this.handlePayDeposit = this.handlePayDeposit.bind(this);
        this.handleWithdrawRent = this.handleWithdrawRent.bind(this);
        this.handlePayRent = this.handlePayRent.bind(this);
        this.handleWithdrawDeposit = this.handleWithdrawDeposit.bind(this);
    }

    componentDidMount() {
        this.props.leasesContract.deployed().then((smartLeaseInstance) => {
            this.smartLeaseInstance = smartLeaseInstance
        })
    }

    handleSignLease(event) {
        event.preventDefault()
        this.smartLeaseInstance.signLease(this.props.index, {
            from: this.props.account
        })
    }

    handlePayDeposit(event) {
        event.preventDefault()
        this.smartLeaseInstance.payDeposit(this.props.index, {
            from: this.props.account,
            value: this.props.lease.depositToPay
        })
    }

    handlePayRent(event) {
        event.preventDefault()
        this.smartLeaseInstance.payRent(this.props.index, {
            from: this.props.account,
            value: this.props.lease.rentPerMonth
        })
    }

    handleWithdrawRent(event) {
        event.preventDefault()
        this.smartLeaseInstance.withdrawRent(this.props.index, {
            from: this.props.account,
            gas: 50000
        })
    }

    handleWithdrawDeposit(event) {
        event.preventDefault()
        this.smartLeaseInstance.withdrawDeposit(this.props.index, {
            from: this.props.account,
            gas: 50000
        })
    }

    render() {
        switch(this.props.type) {
            case "landlord": {
                switch(this.props.lease.state) {
                    case "created": {
                      return null
                    }
                    case "signed": {
                      return null
                    }
                    case "active": {
                        if (this.props.lease.balanceToBeWithdrawn > 0) {
                            return (
                                <td>
                                  Available: {( this.props.lease.balanceToBeWithdrawn / Math.pow(10,18) ).toString()}
                                  <button onClick={this.handleWithdrawRent} className='btn btn-primary'>Collect Rent</button>
                                </td>
                            )
                        }
                    }
                    case "complete": {
                        if (this.props.lease.balanceToBeWithdrawn > 0) {
                            return (
                                <td>
                                  Available: {( this.props.lease.balanceToBeWithdrawn / Math.pow(10,18) ).toString()}
                                  <button onClick={this.handleWithdrawRent} className='btn btn-primary'>Collect Rent</button>
                                </td>
                            )
                        }
                    }
                    default : 
                        return null
                }
            }
            case "tenant": {
                switch(this.props.lease.state) {
                    case "created": {
                      return (
                          <td>
                              <button onClick={this.handleSignLease} className='btn btn-primary'>Sign</button>
                          </td>
                      )
                    }
                    case "signed": {
                        return (
                            <td>
                                <button onClick={this.handlePayDeposit} className='btn btn-primary'>Pay Deposit</button>
                            </td>
                        )
                    }
                    case "active": {
                        return (
                            <td>
                                <button onClick={this.handlePayRent} className='btn btn-primary'>Pay Rent</button>
                            </td>
                        )
                    }
                    case "complete": {
                        if (this.props.lease.depositPaid > 0 ) {
                            return (
                                <td>
                                    <button onClick={this.handleWithdrawDeposit} className='btn btn-primary'>Collect Deposit</button>
                                </td>
                            )
                        }
                    }
                    default : 
                      return null
                }
            }
            case "litigator": {
                return null
            }
        }
    }
}

export default DisplayActions