const {
    bufToStr,
    getBalance,
    htlcArrayToObj,
    isSha256Hash,
    newSecretHashPair,
    nowSeconds,
    random32,
    txContractId,
    txGas,
    txLogArgs,
} = require('./utils/utils')
const {assertEqualBN} = require('./utils/assert')


const HashedTimeLockETH = artifacts.require('./HashedTimeLockETH.sol')
const hourSeconds = 3600
const timeLock1Hour = nowSeconds() + hourSeconds
const oneFinney = web3.utils.toWei(web3.utils.toBN(1), 'finney')
const REQUIRE_FAILED_MSG = 'Returned error: VM Exception while processing transaction: revert'


let delayMs = ms => new Promise(resolve => setTimeout(resolve, ms))

contract('HashedTimeLockETH', accounts => {
    const sender = accounts[1]
    const receiver = accounts[2]
    console.log("accounts=>", accounts)
      
    it('createContract should pass create a new contract', async () => {
        const hashPair = newSecretHashPair()
        const htlc = await HashedTimeLockETH.deployed()
        const txReceipt = await htlc.createContract(
            receiver,
            hashPair.hash,
            timeLock1Hour,
            {
                from: sender,
                value: oneFinney,
            }
        )
        // console.log("txReceipt=>", txReceipt)
        const logArgs = txLogArgs(txReceipt)
    
        const contractId = logArgs.contractId
        assert(isSha256Hash(contractId))
    
        assert.equal(logArgs.sender, sender)
        assert.equal(logArgs.receiver, receiver)
        // assertEqualBN(logArgs.amount, oneFinney)

        assert.equal(logArgs.hashlock, hashPair.hash)
        assert.equal(logArgs.timelock, timeLock1Hour)
    
    //   const contractArr = await htlc.getContract.call(contractId)
    //   const contract = htlcArrayToObj(contractArr)
    //   assert.equal(contract.sender, sender)
    //   assert.equal(contract.receiver, receiver)
    //   assertEqualBN(contract.amount, oneFinney)
    //   assert.equal(contract.hashlock, hashPair.hash)
    //   assert.equal(contract.timelock.toNumber(), timeLock1Hour)
    //   assert.isFalse(contract.withdrawn)
    //   assert.isFalse(contract.refunded)
    //   assert.equal(
    //     contract.preimage,
    //     '0x0000000000000000000000000000000000000000000000000000000000000000'
    //   )
    })

    it('createContract should fail when no ETH sent', async () => {
        const hashPair = newSecretHashPair()
        const htlc = await HashedTimeLockETH.deployed()
        try {
            await htlc.createContract(receiver, hashPair.hash, timeLock1Hour, {
                from: sender,
                value: 0,
            })
            assert.fail('expected failure due to 0 value transferred')
        } catch (err) {
            console.log("err======>", err.message)
        }
    })

    it('withdraw should pass send receiver eth when the correct secret', async () => {
        const hashPair = newSecretHashPair()
        const htlc = await HashedTimeLockETH.deployed()
        const txReceipt = await htlc.createContract(
          receiver,
          hashPair.hash,
          timeLock1Hour,
          {
            from: sender,
            value: oneFinney,
          }
        )
    
        const contractId = txContractId(txReceipt)
        const receiverBalanceBefore = await getBalance(receiver)
    
        // receiver calls withdraw with the secret to get the funds
        const withdrawTx = await htlc.withdraw(contractId, hashPair.secret, {
          from: receiver,
        })
        // console.log("withdrawTx=========>", withdrawTx)
        const tx = await web3.eth.getTransaction(withdrawTx.tx)
        // console.log("tx=========>", tx)
        // Check contract funds are now at the receiver address
        const expectedBal = receiverBalanceBefore.add(oneFinney).sub(txGas(withdrawTx, tx.gasPrice))

        // console.log("balance=========>", await getBalance(receiver))
        // console.log("expectedBal=========>", expectedBal)
        assertEqualBN(await getBalance(receiver), expectedBal,"receiver balance doesn't match")
        const contractArr = await htlc.getContractDetail.call(contractId)
        const contract = htlcArrayToObj(contractArr)
        assert.isTrue(contract.withdrawn) 
        assert.isFalse(contract.refunded) 
        // assert.equal(contract.secret, hashPair.secret)
      })

      it.only('refund should pass after timelock expiry', async () => {
        const hashPair = newSecretHashPair()
        const htlc = await HashedTimeLockETH.new()
        const timelock1Second = nowSeconds() + 1
    
        const txReceipt = await htlc.createContract(
            receiver,
            hashPair.hash,
            timelock1Second,
            {
                from: sender,
                value: oneFinney,
            }
        )
        const contractId = txContractId(txReceipt)
        // delay 1s wait time lock expriy
        await delayMs(1000)
        const balBefore = await getBalance(sender)
        const refundTx = await htlc.refund(contractId, {from: sender})
        const tx = await web3.eth.getTransaction(refundTx.tx)
        // Check contract funds are now at the senders address
        const expectedBal = balBefore.add(oneFinney).sub(txGas(refundTx, tx.gasPrice))
        assertEqualBN(
          await getBalance(sender),
          expectedBal,
          "sender balance doesn't match"
        )
        const contract = await htlc.getContractDetail.call(contractId)
        assert.isTrue(contract[6]) // refunded set
        assert.isFalse(contract[5]) // withdrawn still false
    })
      
})