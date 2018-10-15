import React from 'react'

/** @
  * @ Display State of leases 
  * @ Strings explaining lease stage -- signed, active, complete...
  * @ 
  */
class DisplayState extends React.Component {

    render() {

        switch(this.props.lease.state) {
          case "created": {
              return (
                  <th>Tenant Signature Pending</th>
              )
          }
          case "signed": {
              return (
                  <th>Lease Signed, waiting for deposit</th>
              )
          }
          case "active": {
              return <th> Active </th>
          }
          case "complete": {
              return <th> Completed </th>
          }
          default : 
              return <th> Error </th>
        }
    }
}

export default DisplayState
