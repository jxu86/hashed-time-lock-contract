const BaseHTLC = require('./base-htlc')

/**
 * This wrapper can be used for already deployed contracts sharing the main interfaces of HTLCs.
 */
class HtlcEth extends BaseHTLC {
  /**
   * Returns the contract ID.
   * @param receiverAddress address
   * @param hashlock bytes 32
   * @param timelock uint
   * @param sender address
   * @param amount uint
   */
   createContract(receiverAddress, hashlock, timelock, sender, amount) {
    return this.getContractInstance().then((instance) => {
      return instance.createContract(receiverAddress, hashlock, timelock, {
        from: sender,
        value: amount,
      })
    })
  }
}

module.exports = HtlcEth
