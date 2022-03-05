const {
    bufToStr,
    random32,
    htlcERC20ArrayToObj,
    isSha256Hash,
    newSecretHashPair,
    nowSeconds,
    txContractId,
    delayMs,
} = require('./utils/utils')
const {assertEqualBN} = require('./utils/assert')
const { time } = require('console')

const HashedTimeLockERC20 = artifacts.require('./HashedTimeLockERC20.sol')
const TestERC20 = artifacts.require('./erc-token/TestERC20.sol')
const hourSeconds = 3600
const timeLock1Hour = nowSeconds() + hourSeconds
const tokenAmount = 10
const FAILED_MSG = "satisfies all conditions set by Solidity `require` statements"

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
            'balance not transferred in before'
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

    it('createContract should fail when amount = 0', async () => {
        // approve htlc for one token but send amount as 0
        const hashPair = newSecretHashPair()
        await token.approve(htlc.address, 1, {from: sender})
        try {
            await htlc.createContract(
                receiver,
                token.address,
                0,
                hashPair.hash,
                timeLock1Hour,
                {
                    from: sender,
                }
            )
            assert.fail('should fail when amount = 0')
          } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
          }
      })

    it('createContract should fail with no approve', async () => {
        const hashPair = newSecretHashPair()
        try {
            await htlc.createContract(
                receiver,
                token.address,
                tokenAmount,
                hashPair.hash,
                timeLock1Hour,
                {
                    from: sender,
                }
            )
            assert.fail('should fail with no approve')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }
    })
    
    it('withdraw should pass with correct secret', async () => {
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
    })


    it('withdraw should fail when secret is wrong', async () => {
        const hashPair = newSecretHashPair()
        const txReceipt = await createContract({hashlock: hashPair.hash})
        const contractId = txContractId(txReceipt)
    
        const wrongSecret = bufToStr(random32())
        try {
            await htlc.withdraw(contractId, wrongSecret, {from: receiver})
            assert.fail('fail when secret is wrong')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }
    })

    it('withdraw should fail when time lock has expired', async () => {
        const hashPair = newSecretHashPair()
        const timelock1Second = nowSeconds() + 1
        const txReceipt = await createContract({hashlock: hashPair.hash, timelock: timelock1Second})
        const contractId = txContractId(txReceipt)
        await delayMs(2000)
        try {
            await htlc.withdraw(contractId, hashPair.secret, {from: receiver})
            assert.fail('fail when secret is wrong')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }
    })

    it('refund should pass after timelock expiry', async () => {
        const hashPair = newSecretHashPair()
        const timelock1Sec = nowSeconds() + 1
    
        await token.approve(htlc.address, tokenAmount, {from: sender})
        const txReceipt = await createContract({
          timelock: timelock1Sec,
          hashlock: hashPair.hash,
        })
        const contractId = txContractId(txReceipt)

        await delayMs(3000)
        const balanceBefore = await token.balanceOf(sender)
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

    it('refund should fail before timelock expiry', async () => {
        const hashPair = newSecretHashPair()
        await token.approve(htlc.address, tokenAmount, {from: sender})
        const txReceipt = await createContract({
          timelock: timeLock1Hour,
          hashlock: hashPair.hash,
        })
        const contractId = txContractId(txReceipt)
        try {
            await htlc.refund(contractId, {from: sender})
            assert.fail('fail before timelock expiry')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }
    })

})