const BaseService = require('./base')
const { log, AppError } = require('../lib')
// const request = require('superagent')
const CONSTANT = require('../lib/constant')
const _ = require('lodash');

const path = require('path')
const util = require('util')

const blockchainConfig = require('config').get('blockchain')

const BlockchainService = require('./blockchain')

const blockchainService = new BlockchainService()
blockchainService.init()

class EmojiService extends BaseService {
//     async getList () {
//         // const { code }= this.options

//         let emojiType = this.options.type || null

//         let appConfig =  await AppConfig.findOne()
//         // console.log('appConfig===>', appConfig)
//         let ret = []
//         if (appConfig[emojiType]) {
//             ret =  await EmojiInfo.find({cid:{$in: appConfig[emojiType]['cidList']}}, {emojiPkg: 1, emojiName: 1, filePath: 1, emojiPkgId: 1, _id: 0})
//         } else {
//             ret = await this.getEmojiPkgByCondition({"auditState": "pass"})
//         }
//         return ret
//     }
    
//     // 获取一个表情包的所有表情
//     async getEmojiPkg () {
//         const { emojiPkgId }= this.options
//         // 获取标签列表
//         let emojiList = await EmojiInfo.find({emojiPkgId: emojiPkgId},{_id:0,tags:0,openId:0,desc:0,localFilePath:0})
//         // 获取表情包信息
//         const EmojiPkgInfo = await EmojiPkg.findOne({emojiPkgId: emojiPkgId})
//         // 获取用户信息
//         const userInfo = await User.findOne({openId: EmojiPkgInfo.openId})
 

//         let nickName = ''
//         let avatarUrl = ''
//         if (userInfo && userInfo.userInfo){
//             nickName = userInfo.userInfo.nickName
//             avatarUrl = userInfo.userInfo.avatarUrl
//         }

//         let bannerEmojiInfo = null
//         if (EmojiPkgInfo.bannerCid) {
//             bannerEmojiInfo = _.find(emojiList, (emoji)=> {return emoji.cid == EmojiPkgInfo.bannerCid})
//             // 如果是我们自己平台上传的，删除列表里面的banner图
//             _.remove(emojiList,(e)=>{return e.cid==bannerEmojiInfo.cid})
//         } 

//         if (!bannerEmojiInfo) {
//             // 没有设置每个表情包的banner的话就默认表情包里面的第一张
//             bannerEmojiInfo = emojiList[0]
//         }
        
        
//         let ret = {}
//         if (emojiList.length || bannerEmojiInfo) {
//             ret = {
//                 "nickName": nickName,
//                 "avatarUrl": avatarUrl,
//                 "emojiPkgId": EmojiPkgInfo['emojiPkgId'],
//                 "emojiPkg": EmojiPkgInfo['emojiPkg'],
//                 "tags": EmojiPkgInfo['tags'],
//                 "desc": EmojiPkgInfo['desc'],
//                 "banner": bannerEmojiInfo,
//                 "emojiList": emojiList
//             }
//         } 

//         return ret
//     }

//     async getEmojiPkgByCondition (emojiPkgQuery) {

//         console.log('emojiPkgQuery=>', emojiPkgQuery)
//         const fields = { desc: 1, tags: 1, emojiPkgId: 1, emojiPkg: 1, frontCover: 1, _id: 0}
//         let emojiPkgInfo = await EmojiPkg.find(emojiPkgQuery, fields).sort({createdAt: -1})
//         let emojiPkgList = []
        
//         // console.log('emojiPkgInfo=>', emojiPkgInfo)

//         const emojiPkgInfoLen = emojiPkgInfo.length
//         for (let i=0; i <emojiPkgInfoLen; i++) {
//             let info = emojiPkgInfo[i]
//             // console.log('info=>', info)
//             let query = {
//                 emojiPkgId: info.emojiPkgId
//             }

//             if (info['frontCover']) {
//                 query['cid'] = info['frontCover']
//             }
//             // console.log('query=>', query)

//             let emojiInfo = await EmojiInfo.findOne(query, {filePath: 1, emojiName: 1, _id: 0, createdAt: 1})
//             if (emojiInfo) {
//                 emojiPkgList.push({
//                     'emojiName': emojiInfo.emojiName,
//                     'filePath': emojiInfo.filePath,
//                     'emojiPkgId': info.emojiPkgId,
//                     'emojiPkg': info.emojiPkg,
//                     'desc': info.desc,
//                     'tags': info.tags,
//                     'createdAt': moment(emojiInfo.createdAt).format('YYYY-MM-DD HH:mm:ss')
//                 })
//             }
//         }

//         console.log('emojiPkgList len: ', emojiPkgList.length)
//         return emojiPkgList;
//     }

//     async getMyEmojiPkg () {
//         const { openId, emojiPkgId }= this.options

//         let emojiPkgQuery = {
//             "openId": openId,
//         }
//         if (emojiPkgId) {
//             emojiPkgQuery['emojiPkgId'] = emojiPkgId
//         }

//         console.log('emojiPkgQuery=>', emojiPkgQuery)
//         // let emojiPkgInfo = await EmojiPkg.find(emojiPkgQuery, { desc: 1, tags: 1, emojiPkgId: 1, emojiPkg: 1, _id: 0, createdAt: 1})
//         let ret = {
//             emojiList: await this.getEmojiPkgByCondition(emojiPkgQuery)
//         }
//         return ret
//     }
// // Qma4vHBvypwkv5noNAftb2KZ2VU685R7qhC8r31qKWstzd

// // { "_id" : ObjectId("5e1589a65062b2956872a86a"), "banner" : { "cidList" : [ "QmW9dCFH49p6aBSX9Pt7xmYyjZndfeWRzedQFpjncMnUXP", "QmUXYe6PnnWtQ6KEcnCVfsEKonARtRDEjQwraZ7tYVhDhk", "QmNnNozV8SExxfCg3eJmAGgqy1nbZFqnL2BLGRpKhMhL1M" ] }, "newest" : { "cidList" : [ "QmPQY4yVWiShwKfRbcNFJgZ5MRAS7GTyTPjWSATiLwgFem", "Qma19WAqr4rkDPCYyBDqofhCuJmw3rms1258i9Ndy3vtZz", "QmQWgktPecNM5F5JhTZoTnT7VGcitdmn7vGanCHA6Gn6XR", "QmUaWQG5sv86NCUyMzijUGv8RABEmSzfxa4z9iDHisBncy", "QmWj3dt1UCkySsXeK7UC2d9uxn2QHr52YvRmmciPLmjK4W", "QmUGvhi3HSQFsrKFpzHf1RiNwEMWeUD8P22DhvwpCsb2ri" ] }, "hot" : { "cidList" : [ "QmXSkpsyHDt5p3XkK29jTdNCjFPgQHsL29vPdzrHUK8QcV", "QmenW3nbBQEVCzgDKpRnqgxBTwd5Rt7E2bTS7y4Q71KzRQ", "QmUdquCa11Hhs84PqBAxoNBKC16v7JoQEeXVjZgvKu6JRp" ] } }
// // { "cidList" : [ "Qma4vHBvypwkv5noNAftb2KZ2VU685R7qhC8r31qKWstzd", "QmW9dCFH49p6aBSX9Pt7xmYyjZndfeWRzedQFpjncMnUXP", "QmUXYe6PnnWtQ6KEcnCVfsEKonARtRDEjQwraZ7tYVhDhk", "QmNnNozV8SExxfCg3eJmAGgqy1nbZFqnL2BLGRpKhMhL1M" ] }   
//     async homePage () {
//         let appConfig =  await AppConfig.findOne()
//         console.log('appConfig===>', appConfig)
//         const emojiInfofields = {emojiPkg: 1, emojiName: 1, filePath: 1, emojiPkgId: 1, cid: 1, _id: 0}
//         const banners =  await EmojiInfo.find({cid:{$in: appConfig.banner.cidList}, auditState: 'pass'}, emojiInfofields)
//         const newests =  await EmojiInfo.find({cid:{$in: appConfig.newest.cidList}, auditState: 'pass'}, emojiInfofields)
//         const hots =  await EmojiInfo.find({cid:{$in: appConfig.hot.cidList}, auditState: 'pass'}, emojiInfofields)
        
//         let emojiPkgIds = _.map(banners, 'emojiPkgId')
//         emojiPkgIds =_.concat(emojiPkgIds, _.map(newests, 'emojiPkgId'))
//         emojiPkgIds =_.concat(emojiPkgIds, _.map(hots, 'emojiPkgId'))
//         const emojiPkgInfo = await EmojiPkg.find({emojiPkgId:{$in: emojiPkgIds}, auditState: 'pass'}, { desc: 1, tags: 1, emojiPkgId: 1, _id: 0})

//         _.forEach(banners, (b)=> {
//             let tmp = _.find(emojiPkgInfo, (e)=> {return e.emojiPkgId==b.emojiPkgId;})
//             if (tmp) {
//                 b['desc'] = tmp['desc']
//                 b['tags'] = tmp['tags']
//             }
//         })

//         _.forEach(newests, (b)=> {
//             let tmp = _.find(emojiPkgInfo, (e)=> {return e.emojiPkgId==b.emojiPkgId;})
//             if (tmp) {
//                 b['desc'] = tmp['desc']
//                 b['tags'] = tmp['tags']
//             }
//         })

//         _.forEach(hots, (b)=> {
//             let tmp = _.find(emojiPkgInfo, (e)=> {return e.emojiPkgId==b.emojiPkgId;})
//             if (tmp) {
//                 b['desc'] = tmp['desc']
//                 b['tags'] = tmp['tags']
//             }
//         })

//         let bannerSort = []
//         _.forEach(appConfig.banner.cidList, (cid)=> {
//             let tmp = _.find(banners, (h)=> {return cid==h.cid;})
//             if (tmp) {
//                 bannerSort.push(tmp)
//             }
//         })

//         bannerSort[0]['imgUrl'] = "https://mp.weixin.qq.com/s/d1YB7CKT0OrV3AUsJXQjyA"
//         let newestSort = []
//         _.forEach(appConfig.newest.cidList, (cid)=> {
//             let tmp = _.find(newests, (h)=> {return cid==h.cid;})
//             if (tmp) {
//                 newestSort.push(tmp)
//             }
//         })

//         let hotSort = []
//         _.forEach(appConfig.hot.cidList, (cid)=> {
//             let tmp = _.find(hots, (h)=> {return cid==h.cid;})
//             if (tmp) {
//                 hotSort.push(tmp)
//             }
//         })


//         let result = {
//             banner: bannerSort,
//             newest: newestSort,
//             hot: hotSort
//         }
//         console.log('result===>', JSON.stringify(result))

//         return result
//     }

//     async getTags () {
//         return CONSTANT.EMOJI_TAGS
//     }

//     async setEmojiPkg(options) {

//         let { openId, emojiPkgId, emojiPkg, tags, desc } = options
//         if (!openId || !emojiPkg) {
//             return new AppError('参数错误', 1)
//         }

//         emojiPkgId = emojiPkgId || uuid.v4()
//         let emojiPkgData = {
//             "openId": openId,
//             "emojiPkgId": emojiPkgId,
//             "emojiPkg": emojiPkg,
//             "frontCover": "",
//             "emojiPkgId" : emojiPkgId,
//             "tags": tags.split(";"),
//             "desc": desc,
//             "auditState": "auditing"
//         }
//         // await EmojiPkg.update({openId: emojiPkgData.openId, emojiPkgId: emojiPkgData.emojiPkgId},{$set: emojiPkgData}, { upsert: true })
//         const ret = await EmojiPkg.findOneAndUpdate({openId: emojiPkgData.openId, emojiPkgId: emojiPkgData.emojiPkgId},{$set: emojiPkgData}, { upsert: true, new: true })
//         console.log(`#setEmojiPkg=>setEmojiPkg:${ret}`)
//         return ret.emojiPkgId
//     }

//     async upload () {
//         const { openId, emojiPkg, tags, desc, imgfiles} = this.options
//         // 写入表情包信息
//         let emojiPkgId = await this.setEmojiPkg(this.options)
//         console.log(`##openId:${openId},emojiPkgId:${emojiPkgId}`)
//         if (!emojiPkgId) {
//             return new AppError('上传错误', 1)
//         }

//         // const emojiPkgId = emojiPkgId || uuid.v4()
//         const imgFileLen = imgfiles.length
//         const ipfsService = new IpfsService()
//         for (let i=0; i <imgFileLen; i++) {
//             const file = imgfiles[i]
//             let cid = uuid.v4()
//             let updateData = {
//                 "openId": openId,
//                 "emojiPkgId": emojiPkgId,
//                 "emojiPkg": emojiPkg,
//                 "emojiName": file.name,
//                 "localFilePath": file.path,
//                 "fileName": '',
//                 "filePath": '',
//                 "cid": cid,
//                 "fileType": file.type,
//                 "tags": tags.split(";"),
//                 "desc": desc,
//                 "uploadChannel": "wechat",
//                 "auditState": "auditing"
//             }
//             let query = {
//                 "openId": openId,
//                 "emojiPkg": emojiPkg,
//                 "emojiName": updateData.emojiName
//             }

//             let pathArray = file.path.split("/")
//             let qiniuFileKey = pathArray[pathArray.length-1]
//             // 文件上传7牛，早期版本用7牛存储图片
//             // console.log(`##file.path:${file.path},qiniuFileKey:${qiniuFileKey}`)
//             // let fileRet = await new QiniuService().upload(file.path, qiniuFileKey)
            
//             // console.log(`qiniu fileRet:${JSON.stringify(fileRet)}`)
//             // if (fileRet && fileRet.key && (fileRet.key == qiniuFileKey)) {
//             //     updateData.filePath = `${qiniuConfig.cdnDomain}${fileRet.key}`
//             // }
//             //======================================================================//
//             updateData.fileName = qiniuFileKey

//             // 文件上传ipfs
//             try {
//                 let fileRet = await ipfsService.addFromFs(file.path)
//                 console.log(`ipfs fileRet:${JSON.stringify(fileRet)}`)
//                 if (fileRet && fileRet.length) {
//                     updateData.cid = fileRet[0]['hash']
//                     updateData.filePath = ipfsConfig.gateway+fileRet[0]['hash']
//                 }
//             } catch (e) {
//                 console.log(`ipfs addFromFs error:${e}`);
//             }
//             //======================================================================//
//             // 文件信息入数据库
//             // const ret = await EmojiInfo.update(query,{$set: updateData}, { upsert: true })
//             const ret = await EmojiInfo.findOneAndUpdate(query,{$set: updateData}, { upsert: true, new: true })
//             console.log('EmojiInfo update ret:', ret)
//             //======================================================================//
//             // 文件信息上链
//             try {
//                 if (blockchainConfig.enabled && ret && ret._id) {
//                     let info = {
//                         "obejectId": ret._id + '',
//                         "openId": ret.openId,
//                         "emojiName": ret.emojiName,
//                         "emojiPkg": ret.emojiPkg,
//                         "filePath": ret.cid,
//                         "tags": "",
//                         "desc": "",
//                         "addr": "",
//                         "createdAt": moment(ret.createdAt).format('YYYY-MM-DD HH:mm:ss'),
//                         "updatedAt": moment(ret.updatedAt).format('YYYY-MM-DD HH:mm:ss')
//                     }
//                     console.log('setEmojiInfo info: ', info)
//                     let transactionHash = null
//                     blockchainService.setEmojiInfo(info,function(event, data){
//                         console.log(`event: ${event} data: ${data}`)
//                         if (event == 'transactionHash') {
//                             transactionHash = data
//                         } else if (event == 'receipt') {
//                             console.log('#########transactionHash=>', transactionHash)
//                             const updateData = {blockChainInfo: {transactionHash: transactionHash, state: 'success'}}
//                             EmojiInfo.findByIdAndUpdate(info.obejectId,{$set: updateData}).then(res=> {console.log(res)})
//                         } else if (event == 'error') {
//                             const updateData = {blockChainInfo: {transactionHash: transactionHash, state: 'fail'}}
//                             EmojiInfo.findByIdAndUpdate(info.obejectId,{$set: updateData}).then(res=> {console.log(res)})
//                         }
//                     })
//                 } 
//             } catch(e) {
//                 console.log(`blockchain insert error:${e}`);
//             }
//             //======================================================================//
//         }

//         console.log('emojiPkgId: ', emojiPkgId)
//         return { emojiPkgId }
//     }

    


    


    async getBookMark () {

    }

   
}

module.exports = EmojiService;