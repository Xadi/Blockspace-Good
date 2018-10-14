import React from 'react'

class CreateLeaseForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            account:'0x0',
            displayForm: false,
            tenantEthAddress: '',
            litigatorEthAddress: '',
            physicalAddress: '',
            rent: 0,
            deposit: 0,
            durationInMonth: 1
        };

        this.createLease = this.createLease.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    componentDidMount() {
        this.props.web3.eth.getCoinbase((err, account) => {
            this.setState({account: account})
            this.props.leasesContract.deployed().then((smartLeaseInstance) => {
                this.smartLeaseInstance = smartLeaseInstance
            })
        })
    }

    createLease(_tenant, _litigator, _physicalAddress, _rent, _deposit) {
        this.smartLeaseInstance.createLease(
            _tenant,
            _litigator,
            _physicalAddress,
            _rent,
            _deposit, 
            {from: this.state.account}
        )
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            displayForm: true
        })
    }

    handleTextChange(event) {
        event.preventDefault()
        var value = event.target.value
        switch (event.target.getAttribute("id")) {
            case "tenantEthAddress":
                this.setState({
                    tenantEthAddress: value
                });
            case "litigatorEthAddress":
                this.setState({
                    litigatorEthAddress: value
                });
            case "physicalAddress":
                this.setState({
                    physicalAddress: value
                });
            case "rent":
                this.setState({
                    rent: value
                })
            case "deposit":
                this.setState({
                    deposit: value
                })
        }
    }

    handleSubmit(event) {
        event.preventDefault()

        var tempRent = (this.state.rent * Math.pow(10, 18))
        var tempDeposit = (this.state.deposit * Math.pow(10, 18))

        this.createLease(
            this.state.tenantEthAddress,
            this.state.litigatorEthAddress,
            this.state.physicalAddress,
            tempRent,
            tempDeposit
        )
        this.setState({
            displayForm: false
        })
    }

    render() {
      if (this.state.displayForm) {
          return(
              <form onSubmit={this.handleSubmit}>
                  <div>
                      <label> Tenant ETH Address: </label>
                      <input id="tenantEthAddress" type="text" onChange={this.handleTextChange} />
                  </div>
                  <div>
                      <label> Litigator ETH Address: </label>
                      <input id="litigatorEthAddress" type="text" onChange={this.handleTextChange} />
                  </div>
                  <div>
                      <label> Physical Address of the Lease: </label>
                      <input id="physicalAddress" type="text" onChange={this.handleTextChange} />
                  </div>
                  <div>
                      <label> Rent per month (ETH): </label>
                      <input id="rent" type="text" onChange={this.handleTextChange} />
                  </div>
                  <div>
                      <label> Deposit (ETH): </label>
                      <input id="deposit" type="text" onChange={this.handleTextChange} />
                  </div>
                  <div>
                      <button className='btn btn-primary' type="submit" value="Submit" > Create Lease </button>
                  </div>
              </form>
          )
      }
      else {
          return (
              <button onClick={this.handleChange} className='btn btn-primary'>Create new Lease</button>
          )
      }
    }

}

export default CreateLeaseForm