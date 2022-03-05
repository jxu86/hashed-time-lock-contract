const contract = require("@truffle/contract")
const Web3 = require('web3')
const blockchainConfig = require('config').get('blockchain')
class BaseHTLC {
  /**
   * For additional information concerning the constructor parameters,
   * @see https://www.npmjs.com/package/@truffle/contract
   * Necessary parameters for the constructor are @param contractJson, @param provider, and @param shouldDeploy.
   *
   */
  constructor(contractJson, provider, optionalAddress) {
    this.htlc = contract(contractJson)
    if (provider == null) {
      provider = new Web3.providers.HttpProvider(blockchainConfig.rpc)
    } 
    this.htlc.setProvider(provider)
    this.address = optionalAddress
  }

  /**
   * @param contractId bytes32
   * @param preimage bytes32
   * @param receiver address
   */
  withdraw(contractId, preimage, receiver) {
    return this.getContractInstance().then((instance) => {
      return instance.withdraw(contractId, preimage, {from: receiver})
    })
  }

  /**
   * @param contractId bytes 32
   * @param sender address
   */
  refund(contractId, sender) {
    return this.getContractInstance().then((instance) => {
      return instance.refund(contractId, {from: sender})
    })
  }

  /**
   * @param contractId bytes 32
   */
  getContractDetail(contractId) {
    return this.getContractInstance().then((instance) => {
      return instance.getContractDetail(contractId)
    })
  }

  getContractInstance() {
    if (this.address !== undefined && this.address !== null) {
      return this.htlc.at(this.address)
    }
    return this.htlc.deployed()
  }

  setAddress(address) {
    this.address = address
  }

  static deployContract(contractJson, argArray, txParams) {
    return contractJson.new(argArray, txParams);
  }
}

module.exports = BaseHTLC
