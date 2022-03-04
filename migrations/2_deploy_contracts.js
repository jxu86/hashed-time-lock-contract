const HashedTimeLockETH = artifacts.require('./HashedTimeLockETH.sol')
const HashedTimeLockERC20 = artifacts.require('./HashedTimeLockERC20.sol')
const HashedTimeLockERC721 = artifacts.require('./HashedTimeLockERC721.sol')

module.exports = function (deployer) {
  deployer.deploy(HashedTimeLockETH)
  deployer.deploy(HashedTimeLockERC20)
  deployer.deploy(HashedTimeLockERC721)
}
