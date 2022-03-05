const {
    bufToStr,
    getBalance,
    htlcERC20ArrayToObj,
    isSha256Hash,
    newSecretHashPair,
    nowSeconds,
    random32,
    txContractId,
    txGas,
    txLogArgs,
    delayMs,
} = require('./utils/utils')
const {assertEqualBN} = require('./utils/assert')

const HashedTimeLockERC20 = artifacts.require('./HashedTimeLockERC20.sol')
const TestERC20 = artifacts.require('./erc-token/TestERC20.sol')
const hourSeconds = 3600
const timeLock1Hour = nowSeconds() + hourSeconds
const tokenAmount = 10

contract('HashedTimeLockERC20', accounts => {
    const sender = accounts[1]
    const receiver = accounts[2]
    const tokenSupply = 100000
    const initialBalance = 10000


    const assertTokenBalance = async (addr, tokenAmount, msg) =>
    assertEqualBN(
      await token.balanceOf.call(addr),
      tokenAmount,
      msg ? msg : 'wrong token balance'
    )

    before(async () => {
        htlc = await HashedTimeLockERC20.new()
        token = await TestERC20.new(tokenSupply)
        await token.transfer(sender, initialBalance)
        await assertTokenBalance(
            sender,
            initialBalance,
            'balance not transferred in before()'
        )
    })

    const createContract = async ({
        timelock = timeLock1Hour,
        hashlock = newSecretHashPair().hash,
    }) => {
    await token.approve(htlc.address, tokenAmount, {from: sender})
    return htlc.createContract(
        receiver,
        token.address,
        tokenAmount,
        hashlock,
        timelock,
        {
            from: sender,
        }
    )}

    it('createContract should create a new contract and check contract data', async () => {
        const hashPair = newSecretHashPair()
        const txReceipt = await createContract({
            hashlock: hashPair.hash,
        })
        // console.log("txReceipt=>", txReceipt)
        // check token balances
        assertTokenBalance(sender, initialBalance - tokenAmount)
        assertTokenBalance(htlc.address, tokenAmount)

        const contractId = txContractId(txReceipt)
        assert(isSha256Hash(contractId))
        
        const contractDeail = await htlc.getContractDetail.call(contractId)
        const contractDeailObj = htlcERC20ArrayToObj(contractDeail)
        assert.equal(contractDeailObj.sender, sender)
        assert.equal(contractDeailObj.receiver, receiver)
        assert.equal(contractDeailObj.tokenContract, token.address)
        assert.equal(contractDeailObj.amount.toNumber(), tokenAmount)
        assert.equal(contractDeailObj.hashlock, hashPair.hash)
        assert.equal(contractDeailObj.timelock.toNumber(), timeLock1Hour)
        assert.isFalse(contractDeailObj.isWithdraw)
        assert.isFalse(contractDeailObj.isRefund)
    })

    

    it('withdraw should send receiver funds when given the correct secret', async () => {
        const hashPair = newSecretHashPair()
        const txReceipt = await createContract({hashlock: hashPair.hash})
        const contractId = txContractId(txReceipt)
    
        // receiver calls withdraw with the secret to claim the tokens
        await htlc.withdraw(contractId, hashPair.secret, {
          from: receiver,
        })
    
        // Check tokens now owned by the receiver
        await assertTokenBalance(
          receiver,
          tokenAmount,
          `receiver doesn't own ${tokenAmount} tokens`
        )
    
        const contractArr = await htlc.getContractDetail.call(contractId)
        const contract = htlcERC20ArrayToObj(contractArr)
        assert.isTrue(contract.isWithdraw) // withdrawn set
        assert.isFalse(contract.isRefund) // refunded still false
        // assert.equal(contract.preimage, hashPair.secret)
    })

    it('refund should pass after timelock expiry', async () => {
        const hashPair = newSecretHashPair()
        // const curBlock = await web3.eth.getBlock('latest')
        // const timelock1Sec = curBlock.timestamp + 1
        const timelock1Sec = nowSeconds() + 1
    
        await token.approve(htlc.address, tokenAmount, {from: sender})
        const txReceipt = await createContract({
          timelock: timelock1Sec,
          hashlock: hashPair.hash,
        })
        const contractId = txContractId(txReceipt)

        await delayMs(3000)
        const balanceBefore = await token.balanceOf(sender)
        console.log("balanceBefore=>", balanceBefore)
        await htlc.refund(contractId, {from: sender})

        await assertTokenBalance(
            sender,
            balanceBefore.add(web3.utils.toBN(tokenAmount)),
            `sender balance unexpected`
        )

        const contractArr = await htlc.getContractDetail.call(contractId)
        const contract = htlcERC20ArrayToObj(contractArr)
        assert.isFalse(contract.isWithdraw)
        assert.isTrue(contract.isRefund)
    })

})