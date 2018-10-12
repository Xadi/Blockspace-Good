pragma solidity ^0.4.2;

contract Leases {
	
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

    struct LeaseDetail {
    	uint rentPerMonth;
   		uint depositToPay;
   		uint depositPaid;
	   	uint totalRentToPay;
	   	uint rentPaid;
	   	uint durationInMonth;
	   	uint balanceToBeWithdrawn;
    }
    
    Lease[] public leases;
    LeaseDetail[] public leasesDetails;
    
    uint public leasesCount;
    
    mapping (uint => address) public leaseIndexToOwner;
    mapping (address => uint) public ownershipContractCount;

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
	}

	function createLease(
						address _tenant, 
						address _litigator, 
						string _physicalAddress, 
						uint _rentPerMonth, 
						uint _deposit) 
		public 
		returns(bool) 
		{
			leases.push(Lease(
				msg.sender,  
				_tenant, 
				_litigator, 
				_physicalAddress, 
				"test", 
				"created", 
				false,
				leasesCount
				));

			leasesDetails.push(LeaseDetail(
				_rentPerMonth, 
				_deposit,
				0,
				_rentPerMonth*1,
				0,
				1,
				0
				));

			leaseIndexToOwner[leasesCount] = msg.sender;
			ownershipContractCount[msg.sender]++;
			emit leaseCreatedEvent(leasesCount);
			leasesCount++;
			return true;
		}

	function signLease(uint _index) 
		public
		returns(bool)
		{
			require(msg.sender == leases[_index].tenant);
			leases[_index].signature = true;
			leases[_index].state="signed";
			emit leaseSignedEvent(leases[_index].index);
			return true;
		}

	function payDeposit(uint _index)
		public 
		payable
		returns(bool)
		{
			require(msg.sender == leases[_index].tenant);
			require(msg.value == leasesDetails[_index].depositToPay);
			leasesDetails[_index].depositPaid += msg.value;
			leases[_index].state = "active";
			emit depositFullEvent(leases[_index].index);
			return true;
		}

	function payRent(uint _index)
		public
		payable
		returns(bool)
		{
			require(msg.sender == leases[_index].tenant);
			require(msg.value == leasesDetails[_index].rentPerMonth);
			leasesDetails[_index].rentPaid += msg.value;
		    leasesDetails[_index].balanceToBeWithdrawn += msg.value;
			emit rentPaidMonth(leases[_index].index);
			if (leasesDetails[_index].rentPaid == leasesDetails[_index].totalRentToPay) {
				leases[_index].state = "complete";
			}
			return true;
		}

	function withdrawRent(uint _index)
		public
		returns(bool)
		{
			require(msg.sender == leases[_index].landlord);
			address(leases[_index].landlord).transfer(leasesDetails[_index].balanceToBeWithdrawn);
			leasesDetails[_index].balanceToBeWithdrawn = 0;
			emit rentWithdrawn(leases[_index].index);
			return true;
		}

	function withdrawDeposit(uint _index)
		public
		returns(bool)
		{
			require(msg.sender == leases[_index].tenant);
			require(equal(leases[_index].state, "complete" ));
			address(leases[_index].tenant).transfer(leasesDetails[_index].depositPaid);
			leasesDetails[_index].depositPaid = 0;
			emit depositWithdrawn(leases[_index].index);
			return true;
		}












	function compare(string _a, string _b) public pure returns (int) {
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
    function equal(string _a, string _b) public pure returns (bool) {
        return compare(_a, _b) == 0;
    }
    /// @dev Finds the index of the first occurrence of _needle in _haystack
    function indexOf(string _haystack, string _needle) public pure returns (int)
    {
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