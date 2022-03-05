const Web3 = require('web3')
const blockchainConfig = require('config').get('blockchain')
const ABI = require('../lib/abi')

class BlockchainService {

    async init() {
        if (typeof this.web3 !== 'undefined') {
            this.web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            this.web3 = new Web3(new Web3.providers.HttpProvider(blockchainConfig.rpc))
            // this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8100"))
        }
        this.eth = this.web3.eth
    
        this.emojiContractInstance = new this.web3.eth.Contract(ABI.emojiContractABI,blockchainConfig.emojiContractAddress)
        // this.emojiContractInstance = new this.web3.eth.Contract(ABI.emojiContractABI,"0x9fa5Ad1ed146f6a37F782d1c293Ed7b737a2ab7f")
        this.coinbase = await this.web3.eth.getCoinbase()
        // this.coinbase = this.web3.eth.accounts[0]
        this.contractOption = {from: this.coinbase, gas: 3141592, gasPrice: 18000000000}
        // this.contractOption = {from: this.coinbase}
        console.log(`coinbase:${this.coinbase}`)
        this.eth.defaultAccount = this.coinbase
        console.log('contractOption===>', this.contractOption)
    }

    async setUserInfoAsync(){
        let openid = 'oHJ0d5EncP4ADwpPNCBVMROAbAu4'
        let nickname = 'JC'
        let gender = '1'
        let wechat = ''
        let phone = '18719460360'
        let sessionKey = ''
        let unionId = ''
        const ret = await this.emojiContractInstance.methods.setUserInfo(openid, nickname, gender, wechat, phone, sessionKey, unionId).send(this.contractOption)
        return ret
    }


    setUserInfo(userInfo, cb){
        const { openId, nickname, gender, wechat, phone, sessionKey, unionId } = userInfo
        console.log('contractOption===>', this.contractOption)
        this.emojiContractInstance.methods.setUserInfo(openId, nickname, gender, wechat, phone, sessionKey, unionId)
        .send(this.contractOption)
        .on('transactionHash', (hash)=>{
            console.log('setUserInfo=>hash=========>', hash)
            cb('transactionHash', hash)
        })
        // .on('confirmation', (confirmationNumber, receipt)=>{
        //     console.log('setUserInfo=>confirmationNumber, receipt=========>', confirmationNumber, '===>',receipt)
        // })
        .on('receipt', (receipt)=>{
            console.log('setUserInfo=>receipt=========>', receipt)
            cb('receipt', receipt)
        })
        .on('error', (error)=>{
            console.log('setUserInfo=>error=========>', error)
            console.log('setUserInfo=>error=========>end')
            cb('error', error)
        })
    }

    setEmojiInfo(emojiInfo, cb) {
        const { obejectId, openId, emojiName, emojiPkg, filePath, tags, desc, addr, createdAt,  updatedAt } = emojiInfo
        this.emojiContractInstance.methods.setEmoji(obejectId, openId, emojiName, emojiPkg, filePath, tags, desc, addr, createdAt, updatedAt)
        .send(this.contractOption)
        .on('transactionHash', (hash)=>{
            console.log('setEmojiInfo=>hash=========>', hash)
            cb('transactionHash', hash)
        })
        .on('receipt', (receipt)=>{
            console.log('setEmojiInfo=>receipt=========>', receipt)
            cb('receipt', receipt)
        })
        .on('error', (error)=>{
            console.log('setEmojiInfo=>error=========>', error)
            cb('error', error)
        })
    }

    async getEmojiNumberByOpenId(openId) {
        const num = await this.emojiContractInstance.methods.getEmojiNumberByOpenId(openId).call()
        console.log('getEmojiNumberByOpenId=>num=========>', num)
        return num
    }


    async getEmojiInfoByOpenId(openId) {
        const num = await this.getEmojiNumberByOpenId(openId)
        let emojiInfos = []
        for (let i=0; i<num; i++){
            const info =  await this.emojiContractInstance.methods.getEmojiByOpenId(openId, i).call()
            emojiInfos.push(info)
        }
        console.log('getEmojiInfoByOpenId=>emojiInfos===>', emojiInfos)
        return emojiInfos
    }


    async getUserInfoByOpenId(openId){
        let ret = await this.emojiContractInstance.methods.getUserInfoByOpenId(openId).call()
        console.log('getUserInfoByOpenId=>ret=========>', ret)
    }
}

module.exports = BlockchainService;

// async function main() {
    // const blockchainService = new BlockchainService()
    // await blockchainService.init()
    // blockchainService.setUserInfo({
    //     "openId": "oHJ0d5EncP4ADwpPNCBVMROAbAu5",
    //     "nickname": "JCC",
    //     "gender": "1",
    //     "wechat": "wechat",
    //     "phone": "123122",
    //     "sessionKey":"sdfdsfdsf",
    //     "unionId": ""
    // }, (event, data)=> {
    //     console.log('event==++>', event)
    //     if (event == 'error') {
    //         // console.log('data====>', data.blockHash)
    //         // console.log('data==++>', Object.keys(data))
    //     }
        
    // })
    // await blockchainService.getUserInfoByOpenId('oHJ0d5EncP4ADwpPNCBVMROAbAu5')

    // blockchainService.setEmojiInfo({
    //     "obejectId": '2',
    //     "openId": "oHJ0d5EncP4ADwpPNCBVMROAbAu5",
    //     "emojiName": "test",
    //     "emojiPkg": "1",
    //     "filePath": "ipfs/1221",
    //     "tags": "蒙,型,帅",
    //     "desc":"test",
    //     "addr": "0xcdddd",
    //     "createdAt": "2020-01-16T00:52:18.176Z",
    //     "updatedAt": "2020-01-16T00:52:18.176Z"

    // }, (event, data)=> {
    //     console.log('event==++>', event)
    //     if (event == 'error') {
    //         console.log('data==++>', data)
    //     }
        
    // })

    // await blockchainService.getEmojiNumberByOpenId('oHJ0d5EncP4ADwpPNCBVMROAbAu5')
    // await blockchainService.getEmojiInfoByOpenId('oHJ0d5EncP4ADwpPNCBVMROAbAu5')
    
// }


// main()