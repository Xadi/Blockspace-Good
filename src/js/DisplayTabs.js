import React from 'react'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import CreateLeaseForm from './CreateLeaseForm'
import DisplayLandlordContracts from './DisplayLandlordContracts'
import DisplayTenantContracts from './DisplayLandlordContracts'
import DisplayLitigatorContracts from './DisplayLandlordContracts'

class DisplayTabs extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      key: 1
    };
  }

  handleSelect(key) {
    this.setState({ key });
  }

  render() {
    return (
      <div >
        <br/>
        <table>
          <tbody>
            <tr>
              <th> Your account: {this.props.account} </th>
              <th> Your balance: {this.props.accountBalance.toString()} ETH </th>
            </tr>
          </tbody>
        </table>
        <br/>
        <Tabs
          activeKey={this.state.key}
          onSelect={this.handleSelect}
          id="controlled-tab-example"
        >

          <Tab  eventKey={1} title="Landlord Contracts">
            <br/>
            <CreateLeaseForm account={this.props.account} leasesContract={this.props.leasesContract} />
            <DisplayLandlordContracts
                  account={this.props.account}
                  leasesContract={this.props.leasesContract}
                  signLease={this.props.signLease}
                  payDeposit={this.props.payDeposit}
                  type="landlord"
                  payRent={this.props.payRent}
                  withdrawRent={this.props.withdrawRent}
                  withdrawDeposit={this.props.withdrawDeposit} />
          </Tab>

          <Tab  eventKey={2} title="Tenant Contracts">
            <DisplayTenantContracts 
                  account={this.props.account}
                  leasesContract={this.props.leasesContract}
                  leases={this.props.leasesTenant}
                  signLease={this.props.signLease}
                  payDeposit={this.props.payDeposit}
                  type="tenant"
                  payRent={this.props.payRent}
                  withdrawRent={this.props.withdrawRent}
                  withdrawDeposit={this.props.withdrawDeposit} />
          </Tab>

          <Tab  eventKey={3} title="Litigator Contracts" >
            <DisplayLitigatorContracts 
                  account={this.props.account}
                  leasesContract={this.props.leasesContract}
                  leases={this.props.leasesLitigator}
                  signLease={this.props.signLease}
                  payDeposit={this.props.payDeposit}
                  type="litigator"
                  payRent={this.props.payRent}
                  withdrawRent={this.props.withdrawRent}
                  withdrawDeposit={this.props.withdrawDeposit} />

          </Tab>

        </Tabs>
        <br/>
      </div>
    );
  }

}

export default DisplayTabs