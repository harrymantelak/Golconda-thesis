pragma solidity ^0.4.18;

contract CrowdfundedCharity {

    address private owner;

    event NewFunder(
      address addr,
      uint amount,
      uint campaignID
    );

    event NewCharity(
      address beneficiary,
      uint fundingGoal,
      uint fundingDeadlineBlock
      );

    struct Funder {
        address addr;
        uint amount;
        uint campaignID;
    }

    struct Campaign {
        address beneficiary; // This will be the adress to be paid for the order
        uint id; //This is different from campaign ID, used to identify each campaign from the frontend
        uint fundingGoal;
        uint fundingDeadlineBlock;
        uint numFunders;
        uint amount;
        bytes32 name;
        string description;
        mapping (uint => Funder) funders;
    }

    uint public numCampaigns = 0;
    bytes32 public version;
    mapping (uint => Campaign) public campaigns;

    modifier isAdmin(){
      require(msg.sender == owner);
      _;
    }

    bool private stopped = false;

    function toggleContractActive() isAdmin public {
      stopped = !stopped;
    }

    modifier stopInEmergency { if(!stopped) _;}

    //simple constructor
    function CrowdfundedCharity (bytes32 version_number) public {
    version = version_number;
    owner = msg.sender;
    }

    function newCampaign(address beneficiary, uint goal, uint deadline, bytes32 name, string description) stopInEmergency public returns (uint campaignID) {
        // deadline is given in days. Using the average number of blocks per day
        // we calculate how many blocks the campaign will be valid for.
        campaignID = numCampaigns++;
        uint deadlineBlock = block.number + mul(deadline,5760);
        // campaignID is the return variable
        // Creates new struct and saves in storage. We leave out the mapping type.
        campaigns[campaignID] = Campaign(beneficiary, campaignID + 1, goal, deadlineBlock, 0, 0, name, description);
        //NewCharity(beneficiary, goal, deadlineBlock);
        return campaignID;
    }

   function totalFundsFor(uint8 campaignID) view public returns (uint){
        require(campaignID <= numCampaigns);
        return campaigns[campaignID].amount;
   }

    function contribute(uint campaignID) stopInEmergency public payable {

      Campaign storage c = campaigns[campaignID];
      // Creates a new temporary memory struct, initialised with the given values
      // and copies it over to memory.
      //  require(campaignID <= numCampaigns);
      //  require( c.fundingDeadlineBlock < block.number );
      //  require( c.amount + msg.value < c.fundingGoal );

      c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value, campaignID: campaignID});
      c.amount += msg.value;
      //NewFunder(msg.sender,msg.value,campaignID);
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
      if (a == 0) {
        return 0;
      }
      uint256 c = a * b;
      assert(c / a == b);
      return c;
  }

    function checkGoalReached(uint campaignID) stopInEmergency public returns (bool reached) {
        Campaign storage c = campaigns[campaignID];
        if ( c.fundingDeadlineBlock <= block.number) {
          if (c.amount < c.fundingGoal) {
            //Charity Failed, Initiate Refunds
            for(uint i=1; i<c.numFunders; i++){
              uint refund =c.funders[i].amount;
              c.funders[i].amount =0;
              c.funders[i].addr.transfer(refund);
            }
          }

          if (c.amount >= c.fundingGoal){
            // Charity Successful, Transfer Amount
            uint amount = c.amount;
            c.amount = 0;
            c.beneficiary.transfer(amount);
            return true;
          }
        }

        if (c.amount < c.fundingGoal) {
            return false;
        }
        amount = c.amount;
        c.amount = 0;
        c.beneficiary.transfer(amount);
        return true;
    }
}
