const {
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
const initBalance = 20

contract('HashedTimeLockERC721', accounts => {
    const sender = accounts[1]
    const receiver = accounts[2]

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
        let tokenId = 1
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

    it('withdraw should send receiver funds when given the correct secret', async () => {
        let tokenId = 2
        const hashPair = newSecretHashPair()
        const txReceipt = await createContract({hashlock: hashPair.hash, tokenId: tokenId})
        const contractId = txContractId(txReceipt)
    
        // receiver calls withdraw with the secret to claim the tokens
        await htlc.withdraw(contractId, hashPair.secret, {
          from: receiver,
        })
    
        // Check tokens now owned by the receiver
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

    it('refund should pass after timelock expiry', async () => {
        let tokenId = 3
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

})