const LockBox = artifacts.require("LockBox");
const RandoNFT = artifacts.require("RandoNFT");

module.exports = function (deployer) {
  deployer.deploy(LockBox);
  deployer.deploy(RandoNFT);
};
