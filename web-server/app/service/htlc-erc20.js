const BaseHTLC = require('./base-htlc')


class HtlcErc20 extends BaseHTLC {
  /**
   * Returns the contract ID.
   * @param receiverAddress address
   * @param hashlock bytes 32
   * @param timelock uint
   * @param tokenContract address
   * @param amount uint
   * @param sender address
   */
  createContract(receiverAddress, hashlock, timelock, tokenContract, amount, sender) {
    return this.getContractInstance().then((instance) => {
      return instance.createContract(receiverAddress, hashlock, timelock, tokenContract, amount, {
        from: sender
      })
    })
  }
}

module.exports = HtlcErc20
