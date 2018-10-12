var Leases = artifacts.require("./Leases.sol");

module.exports = function(deployer) {
  deployer.deploy(Leases);
};
