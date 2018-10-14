import React from 'react'
import DisplayActions from './DisplayActions'

class DisplayDetailContracts extends React.Component {

    render() {
        return (
            <table >
                <thead>
                    <tr>
                        <th>Landlord</th>
                        <th>Tenant</th>
                        <th>Litigator</th>
                    </tr>
                </thead>
                <tbody >
                    <tr key={this.props.lease.key}>
                        <td> {this.props.lease.landlord.substring(0,4) + "..." + this.props.lease.landlord.substring(this.props.lease.landlord.length-4,this.props.lease.landlord.length)} </td>
                        <td> {this.props.lease.tenant.substring(0,4) + "..." + this.props.lease.tenant.substring(this.props.lease.tenant.length-4,this.props.lease.tenant.length)} </td>
                        <td> {this.props.lease.litigator.substring(0,4) + "..." + this.props.lease.litigator.substring(this.props.lease.litigator.length-4,this.props.lease.litigator.length)} </td>
                        <td> Rent: {( this.props.lease.rentPaid / Math.pow(10,18) ).toString() } / {( this.props.lease.totalRentToPay / Math.pow(10,18) ).toString() } ETH</td>
                        <td> Deposit: {( this.props.lease.depositPaid / Math.pow(10,18) ).toString() } / {( this.props.lease.depositToPay / Math.pow(10,18) ).toString() } ETH</td>
                        
                        <DisplayActions 
                          account={this.props.account}
                          leasesContract={this.props.leasesContract}
                          lease={this.props.lease}
                          type={this.props.type}
                          index={this.props.lease.key}/> 
                    </tr>
                </tbody>
            </table>     
        );
    }
}

export default DisplayDetailContracts