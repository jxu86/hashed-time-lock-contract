const HashedTimeLockETH = artifacts.require('./HashedTimeLockETH.sol')
// const HashedTimelockERC20 = artifacts.require('./HashedTimelockERC20.sol')
// const HashedTimelockERC721 = artifacts.require('./HashedTimelockERC721.sol')

module.exports = function (deployer) {
  deployer.deploy(HashedTimeLockETH)
  // deployer.deploy(HashedTimelockERC20)
  // deployer.deploy(HashedTimelockERC721)
}
