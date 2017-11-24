pragma solidity ^0.4.18;

contract CrowdfundedCharity {
    // Defines a new type with two fields.
    struct Funder {
        address addr;
        uint amount;
    }
    struct Campaign {
        address beneficiary; // This will be the adress to be paid for the order
        uint fundingGoal;
        uint fundingDeadlineBlock;
        uint numFunders;
        uint amount;
        mapping (uint => Funder) funders;
    }

    uint numCampaigns;
    uint version;
    mapping (uint => Campaign) campaigns;

    //simple constructor
    function CrowdfundedCharity (uint version_number) public {
    version = version_number;
  }

    function newCampaign(address beneficiary, uint goal, uint deadline) public returns (uint campaignID) {
        campaignID = numCampaigns++; // campaignID is return variable
        // Creates new struct and saves in storage. We leave out the mapping type.
        campaigns[campaignID] = Campaign(beneficiary, goal, deadline, 0, 0);
    }

    function contribute(uint campaignID) public payable {
        Campaign storage c = campaigns[campaignID];
        // Creates a new temporary memory struct, initialised with the given values
        // and copies it over to storage.
        // Note that you can also use Funder(msg.sender, msg.value) to initialise.
        require( c.fundingDeadlineBlock < block.number );
        require( c.amount + msg.value > c.fundingGoal );

        c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value});
        c.amount += msg.value;
    }

    function checkGoalReached(uint campaignID) public returns (bool reached) {
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
