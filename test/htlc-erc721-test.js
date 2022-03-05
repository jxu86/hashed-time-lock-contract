const {
    bufToStr,
    random32,
    htlcERC721ArrayToObj,
    isSha256Hash,
    newSecretHashPair,
    nowSeconds,
    txContractId,
    delayMs,
} = require('./utils/utils')
const {assertEqualBN} = require('./utils/assert')

const HashedTimeLockERC721 = artifacts.require('./HashedTimeLockERC721.sol')
const TestERC721 = artifacts.require('./erc-token/TestERC721.sol')
const hourSeconds = 3600
const timeLock1Hour = nowSeconds() + hourSeconds
const initBalance = 30
const FAILED_MSG = "satisfies all conditions set by Solidity `require` statements"

contract('HashedTimeLockERC721', accounts => {
    const sender = accounts[1]
    const receiver = accounts[2]
    let tokenNum = 1

    const assertTokenBalance = async (addr, tokenAmount, msg) => {
        assertEqualBN(
          await token721.balanceOf.call(addr),
          tokenAmount,
          msg ? msg : 'wrong token balance'
        )
      }
    before(async () => {
        htlc = await HashedTimeLockERC721.new()
        token721 = await TestERC721.new()
    
        for (let i = 1; i <= initBalance; i++) {
            await token721.mint(sender, i) 
        }
        // await token721.mint(sender, 1) 
        // await token721.mint(receiver, 7) 
    
        await assertTokenBalance(
            sender,
            initBalance,
            'wrong balance of sender'
        )
        await assertTokenBalance(
            receiver,
            0,
            'wrong balance of receiver'
        )
    })

    const createContract = async ({
        timelock = timeLock1Hour,
        hashlock = newSecretHashPair().hash,
        tokenId,
    }) => {
    await token721.approve(htlc.address, tokenId, {from: sender})
    return htlc.createContract(
        receiver,
        token721.address,
        tokenId,
        hashlock,
        timelock,
        {
            from: sender,
        }
    )}

    it('createContract should create a new contract and check contract data', async () => {
        let tokenId = tokenNum
        tokenNum++
        const hashPair = newSecretHashPair()
        const txReceipt = await createContract({
            hashlock: hashPair.hash,
            tokenId: tokenId,
        })

        assertTokenBalance(sender, initBalance - tokenId)
        assertTokenBalance(htlc.address, 1)

        const contractId = txContractId(txReceipt)
        assert(isSha256Hash(contractId))
        
        const contractDeail = await htlc.getContractDetail.call(contractId)
        const contractDeailObj = htlcERC721ArrayToObj(contractDeail)
        assert.equal(contractDeailObj.sender, sender)
        assert.equal(contractDeailObj.receiver, receiver)
        assert.equal(contractDeailObj.tokenContract, token721.address)
        assert.equal(contractDeailObj.tokenId.toNumber(), tokenId)
        assert.equal(contractDeailObj.hashlock, hashPair.hash)
        assert.equal(contractDeailObj.timelock.toNumber(), timeLock1Hour)
        assert.isFalse(contractDeailObj.isWithdraw)
        assert.isFalse(contractDeailObj.isRefund)
    })

    it('createContract should fail when tokenId not exist', async () => {
        let tokenId = 100
        const hashPair = newSecretHashPair()
        try {
            await createContract({
                hashlock: hashPair.hash,
                tokenId: tokenId,
            }) 
            assert.fail('fail when tokenId not exist')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }
    })

    it('createContract should fail when time lock has expired', async () => {
        let tokenId = tokenNum
        tokenNum++
        const hashPair = newSecretHashPair()
        try {
            await createContract({
                hashlock: hashPair.hash,
                timelock: nowSeconds() - 1,
                tokenId: tokenId,
            }) 
            assert.fail('fail when time lock has expired')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }
    })

    it('createContract should fail when contractId has exist', async () => {
        let tokenId = tokenNum
        tokenNum++
        const hashPair = newSecretHashPair()
        await createContract({
            hashlock: hashPair.hash,
            tokenId: tokenId,
        }) 
        try {
            await createContract({
                hashlock: hashPair.hash,
                tokenId: tokenId,
            }) 
            assert.fail('fail when contractId has exist')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }
    })

    it('withdraw should pass with correct secret', async () => {
        let tokenId = tokenNum
        tokenNum++
        const hashPair = newSecretHashPair()
        const txReceipt = await createContract({hashlock: hashPair.hash, tokenId: tokenId})
        const contractId = txContractId(txReceipt)
    
        await htlc.withdraw(contractId, hashPair.secret, {
          from: receiver,
        })
    
        await assertTokenBalance(
          receiver,
          1,
          `receiver doesn't own 1 tokens`
        )
    
        const contractArr = await htlc.getContractDetail.call(contractId)
        const contract = htlcERC721ArrayToObj(contractArr)
        assert.isTrue(contract.isWithdraw) // withdrawn set
        assert.isFalse(contract.isRefund) // refunded still false
    })

    it('withdraw should fail with wrong secret', async () => {
        let tokenId = tokenNum
        tokenNum++
        const hashPair = newSecretHashPair()
        const txReceipt = await createContract({hashlock: hashPair.hash, tokenId: tokenId})
        const contractId = txContractId(txReceipt)
        const wrongSecret = bufToStr(random32())
        try {
            await htlc.withdraw(contractId, wrongSecret, {
                from: receiver,
            })
            assert.fail('fail with wrong secret')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }
      
    })

    it('withdraw should fail when time lock has expiry', async () => {
        let tokenId = tokenNum
        tokenNum++
        const hashPair = newSecretHashPair()
        const timelock1Second = nowSeconds() + 1
        const txReceipt = await createContract({hashlock: hashPair.hash, timelock: timelock1Second, tokenId: tokenId})
        const contractId = txContractId(txReceipt)
        await delayMs(2000)
        try {
            await htlc.withdraw(contractId, hashPair.secret, {
                from: receiver,
            })
            assert.fail('fail with wrong secret')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }
      
    })

    it('refund should pass after timelock expiry', async () => {
        let tokenId = tokenNum
        tokenNum++
        const hashPair = newSecretHashPair()
        // const curBlock = await web3.eth.getBlock('latest')
        // const timelock1Sec = curBlock.timestamp + 1
        const timelock1Sec = nowSeconds() + 1
    
        await token721.approve(htlc.address, tokenId, {from: sender})
        const txReceipt = await createContract({
          timelock: timelock1Sec,
          hashlock: hashPair.hash,
          tokenId:  tokenId,
        })
        const contractId = txContractId(txReceipt)

        await delayMs(3000)
        const balanceBefore = await token721.balanceOf(sender)
        await htlc.refund(contractId, {from: sender})

        await assertTokenBalance(
            sender,
            balanceBefore.add(web3.utils.toBN(1)),
            `sender balance unexpected`
        )

        const contractArr = await htlc.getContractDetail.call(contractId)
        const contract = htlcERC721ArrayToObj(contractArr)
        assert.isFalse(contract.isWithdraw)
        assert.isTrue(contract.isRefund)
    })

    it('refund should fail when time lock has not expiry', async () => {
        let tokenId = tokenNum
        tokenNum++
        const hashPair = newSecretHashPair()
    
        await token721.approve(htlc.address, tokenId, {from: sender})
        const txReceipt = await createContract({
          timelock: timeLock1Hour,
          hashlock: hashPair.hash,
          tokenId:  tokenId,
        })
        const contractId = txContractId(txReceipt)

        try {
            await htlc.refund(contractId, {from: sender})
            assert.fail('fail when time lock has not expiry')
        } catch (err) {
            assert.isTrue(err.message.includes(FAILED_MSG))
        }

        
        
    })
})