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
        uint state; // states are : 1-successful, 2-unsuccessful, 3-pending
        string name;
        string description;
        mapping (uint => Funder) funders;
    }

    uint public numCampaigns = 0;
    string public version;
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
    function CrowdfundedCharity (string version_number) public {
    version = version_number;
    owner = msg.sender;
    }

    function newCampaign(address beneficiary, uint goal, uint deadline, string name, string description) stopInEmergency public returns (uint campaignID) {
        // deadline is given in days. Using the average number of blocks per day
        // we calculate how many blocks the campaign will be valid for.
        numCampaigns ++;
        campaignID = numCampaigns;
        uint deadlineBlock = block.number + mul(deadline,1); //Changed from 5760
        //for testing purposes.
        // campaignID is the return variable
        // Creates new struct and saves in storage. We leave out the mapping type.
        campaigns[campaignID] = Campaign(beneficiary, campaignID + 1 , goal, deadlineBlock, 0, 0,3, name, description);
        NewCharity(beneficiary, goal, deadlineBlock);
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
      require( campaignID <= numCampaigns);
      require( c.fundingDeadlineBlock > block.number );
      require( c.amount + msg.value <= c.fundingGoal );
      c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value, campaignID: campaignID});
      c.amount += msg.value;
      NewFunder(msg.sender,msg.value,campaignID);
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
        require( c.state > 3);
        if ( c.fundingDeadlineBlock <= block.number) {
          if (c.amount < c.fundingGoal) {
            //Charity Failed, Initiate Refunds
            for(uint i=0; i<c.numFunders; i++){
              uint refund =c.funders[i].amount;
              c.funders[i].amount =0;
              c.funders[i].addr.transfer(refund);
            }
            c.state = 2;
          }

          if (c.amount >= c.fundingGoal){
            // Charity Successful, Transfer Amount
            uint amount = c.amount;
            c.amount = 0;
            c.beneficiary.transfer(amount);
            c.state = 1;
            return true;
          }
        }
        //In case funding ended early
        if (c.amount >= c.fundingGoal){
          // Charity Successful, Transfer Amount
          amount = c.amount;
          c.amount = 0;
          c.beneficiary.transfer(amount);
          c.state = 1;
          return true;
        }

        if (c.amount < c.fundingGoal) {
            return false;
        }
    }

    function destroy() isAdmin public{
      //cleanup function to be used ONLY IN TESTING
      selfdestruct(owner);
    }
}
