var CrowdfundedCharity = artifacts.require("./CrowdfundedCharity.sol");

module.exports = function(deployer) {
  deployer.deploy(CrowdfundedCharity,['1.0.2']);
};
