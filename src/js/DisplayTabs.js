import React from 'react'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import CreateLeaseForm from './CreateLeaseForm'
import DisplayContracts from './DisplayContracts'

/** @
  * @ Display Tabs with Leases inside them
  * @ 
  * @ 
  */
class DisplayTabs extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
          key: 1
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    // handle switching tabs
    handleSelect(key) {
        this.setState({ 
            key
        });
    }

    render() {
        return (
            <div>
                <br/>
                    <Tabs
                      activeKey={this.state.key}
                      onSelect={this.handleSelect}
                      id="controlled-tab-example" >

                          <Tab  eventKey={1} title="Landlord Contracts">
                              <br/>
                              <CreateLeaseForm 
                                web3={this.props.web3} 
                                leasesContract={this.props.leasesContract} />
                              <DisplayContracts
                                    web3={this.props.web3}
                                    leasesContract={this.props.leasesContract}
                                    type="landlord"
                                    categoryToFetch="0" />
                          </Tab>

                          <Tab  eventKey={2} title="Tenant Contracts">
                              <DisplayContracts 
                                    web3={this.props.web3}
                                    leasesContract={this.props.leasesContract}
                                    type="tenant"
                                    categoryToFetch="1" />
                          </Tab>
                          
                          <Tab  eventKey={3} title="Litigator Contracts" >
                              <DisplayContracts 
                                    web3={this.props.web3}
                                    leasesContract={this.props.leasesContract}
                                    type="litigator"
                                    categoryToFetch="2" />
                          </Tab>
                    </Tabs>
                <br/>
            </div>
        )
    }
}

export default DisplayTabs