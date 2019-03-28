pragma solidity ^0.5.0;

/** @title Leases Smart Contract */
contract Leases {
	
	// Hold basic lease information
	struct Lease {
    	address  landlord; 
    	address  tenant;
    	address  litigator;
    	string  physicalAddress;
    	string  hashId;
    	string  state;
    	bool  signature; 
    	uint index;
    }

    // Hold detailed lease information
    struct LeaseDetail {
    	uint rentPerMonth;
   		uint depositToPay;
   		uint depositPaid;
	   	uint totalRentToPay;
	   	uint rentPaid;
	   	uint durationInMonth;
	   	uint balanceToBeWithdrawn;
    }
    
    // Leases storage on the Blockchain
    Lease[] public leases;
    LeaseDetail[] public leasesDetails;
    
    // Total number of leases
    uint public leasesCount;
    
    // keep track of lease ownership -- index of lease => address of owner
    mapping (uint => address) public leaseIndexToOwner;
    // keep track of number of lease by owner -- address of owner => number of leases
    mapping (address => uint) public ownershipContractCount;

    // Events -- throw index of impacted lease
    event leaseCreatedEvent (
        uint indexed index
    );
    event leaseSignedEvent (
    	uint indexed index
    );
    event depositFullEvent (
    	uint indexed index
    );
    event rentPaidMonth (
    	uint indexed index
    );	
    event rentWithdrawn (
    	uint indexed index
    );
    event depositWithdrawn (
    	uint indexed index
    );

	constructor() public {
		// empty constructor -- nothing to do
	}

	/**  Create a new lease
      * param _tenant ethereum address of tenant
      * param _litigator ethereum address of litigator
      * param _physicalAddress -- address of lease 
      * param _rentPerMonth amount in wei
      * param _deposit amount in wei
      * return True if success
      */
	function createLease(
						address _tenant, 
						address _litigator, 
						string memory _physicalAddress, 
						uint _rentPerMonth, 
						uint _deposit) 
		public 
		returns(bool) 
		{
			// push a new lease general information 
			leases.push(
				Lease(
					msg.sender,  // landlord address is the sender of the transaction
					_tenant, 
					_litigator, 
					_physicalAddress, 
					"test", // hash -- for proof of existence not yet implemented
					"created", // state : created
					false, // signed : false
					leasesCount // index of the lease = id of creation
				)
			);

			// push detailed information 
			leasesDetails.push(
				LeaseDetail(
					_rentPerMonth, 
					_deposit,
					0, // set payment balances to 0
					_rentPerMonth*1, // only 1 month duration for testing purposes
					0,
					1,
					0
				)
			);

			// assign ownership of the lease 
			leaseIndexToOwner[leasesCount] = msg.sender;
			ownershipContractCount[msg.sender]++;
			// send event creation
			emit leaseCreatedEvent(leasesCount);
			// increase total count of leases handled by smart contract 
			leasesCount++;
			return true;
		}

	/**  Tenant sign a lease
      * param _index of the lease to be signed
      * return True if success
      */
	function signLease(uint _index) 
		public
		returns(bool)
		{
			// check that the sender is the tenant of the lease
			require(msg.sender == leases[_index].tenant);
			// sign here -- transaction mechanism ensure cryptographic signature
			leases[_index].signature = true;
			// change state to signed
			leases[_index].state="signed";
			// emit event lease signed
			emit leaseSignedEvent(leases[_index].index);
			return true;
		}

	/**  Tenant pay deposit
      * param _index of the affected lease 
      * return True if success
      */
	function payDeposit(uint _index)
		public 
		payable
		returns(bool)
		{
			// check sender is the tenant and ether sent = deposit to pay
			require(msg.sender == leases[_index].tenant);
			require(msg.value == leasesDetails[_index].depositToPay);
			// register that deposit was paid for this lease
			leasesDetails[_index].depositPaid += msg.value;
			// state becomes active 
			leases[_index].state = "active";
			// emit deposit paid event
			emit depositFullEvent(leases[_index].index);
			return true;
		}

	/**  Tenant pay rent
      * param _index of the affected lease 
      * return True if success
      */
	function payRent(uint _index)
		public
		payable
		returns(bool)
		{
			// ensure sender is the tenant and amount of ether sent = rent per month
			require(msg.sender == leases[_index].tenant);
			require(msg.value == leasesDetails[_index].rentPerMonth);
			// register rent was paid
			leasesDetails[_index].rentPaid += msg.value;
		    leasesDetails[_index].balanceToBeWithdrawn += msg.value;
		    // emit event rent paid 
			emit rentPaidMonth(leases[_index].index);
			// if rent is complete, complete the lease
			if (leasesDetails[_index].rentPaid == leasesDetails[_index].totalRentToPay) {
				leases[_index].state = "complete";
			}
			return true;
		}

	/**  Landlord withdraw rent
      * param _index of the affected lease 
      * return True if success
      */
	function withdrawRent(uint _index) 
		public
		payable
		returns(bool)
		{
			// check sender is landlord 
			require(msg.sender == leases[_index].landlord);
			// set balance to 0 before transfer to avoid re-entrancy
			leasesDetails[_index].balanceToBeWithdrawn = 0;
			// transfer money from smart contract to landlord
			address payable wallet = address(uint160(leases[_index].landlord));
			wallet.transfer(leasesDetails[_index].balanceToBeWithdrawn);
			// event rent withdrawn
			emit rentWithdrawn(leases[_index].index);
			return true;
		}

	/**  Tenant withdraw deposit
      * param _index of the affected lease 
      * return True if success
      */
	function withdrawDeposit(uint _index)
		public
		returns(bool)
		{
			// check sender is tenant and the lease status is completed (all rent was paid)
			require(msg.sender == leases[_index].tenant);
			require(equal(leases[_index].state, "complete" ));
			// set balance to 0 before transfer to avoid re-entrancy
			leasesDetails[_index].depositPaid = 0;
			// transfer money from smart contract to tenant
			address payable wallet = address(uint160(leases[_index].tenant));
			wallet.transfer(leasesDetails[_index].depositPaid);
			// event deposit withdrawn 
			emit depositWithdrawn(leases[_index].index);
			return true;
		}


	/**  
      *  
      * 
      *  
      *  Library to compare strings
      *  
      * 
      *  
      *                   
      */		
	function compare(string memory _a, string memory _b) public pure returns (int) {

        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }

    /// @dev Compares two strings and returns true iff they are equal.
    function equal(string memory _a, string memory _b) public pure returns (bool) {

        return compare(_a, _b) == 0;
    }

    /// @dev Finds the index of the first occurrence of _needle in _haystack
    function indexOf(string memory _haystack, string memory _needle) public pure returns (int) {

    	bytes memory h = bytes(_haystack);
    	bytes memory n = bytes(_needle);
    	if(h.length < 1 || n.length < 1 || (n.length > h.length)) 
    		return -1;
    	else if(h.length > (2**128 -1)) // since we have to be able to return -1 (if the char isn't found or input error), this function must return an "int" type with a max length of (2^128 - 1)
    		return -1;									
    	else
    	{
    		uint subindex = 0;
    		for (uint i = 0; i < h.length; i ++)
    		{
    			if (h[i] == n[0]) // found the first char of b
    			{
    				subindex = 1;
    				while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) // search until the chars don't match or until we reach the end of a or b
    				{
    					subindex++;
    				}	
    				if(subindex == n.length)
    					return int(i);
    			}
    		}
    		return -1;
    	}	
    }
}