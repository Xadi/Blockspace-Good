import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Leases from '../../build/contracts/Leases.json'
import DisplayTabs from './DisplayTabs'
import DisplayHeader from './DisplayHeader'
import 'bootstrap/dist/css/bootstrap.css'

/** @
  * @ Blockspace App
  * @ 
  */
class App extends React.Component {
    constructor(props) {
        super(props)

        // Initialize web3 
        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        }
        else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
        }
        this.web3 = new Web3(this.web3Provider)
        
        this.leasesContract = TruffleContract(Leases)
        this.leasesContract.setProvider(this.web3Provider)
    }

    render() {
        return ( 
            <div className = 'row' >
                <div className = 'col-lg-12 text-center' >
                    <DisplayHeader leasesContract = {this.leasesContract}
                      web3 = {this.web3} />

                    <DisplayTabs leasesContract = {this.leasesContract}
                      web3 = {this.web3} />
                </div> 
            </div>
        )
    }
}

ReactDOM.render( <App /> ,
    document.querySelector('#root')
)