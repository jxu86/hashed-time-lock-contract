const EmojiService = require('../service/emoji')
const { log, AppError } = require('../lib')
const Joi = require('joi')
const path = require('path')
const send = require('koa-send')
const fs = require('fs')
class Emoji {
    static async getList (ctx) {

        const opts = ctx.param
        const schema = {
            type: Joi.string(),
            // objectId: Joi.string(),
            // openId: Joi.string().required().error(new AppError('openId错误'))
        }
        console.log('ctx.param====>', ctx.param)
        const emojiService = new EmojiService(opts, schema, ctx)
        ctx.body = await emojiService.getList()
    }


    static async getEmojiPkg (ctx) {
        const opts = ctx.param
        console.log('ctx.param=====>', ctx.param)
        const schema = {
            emojiPkgId: Joi.string().required().error(new AppError('emojiPkgId错误'))
        }
        const emojiService = new EmojiService(opts, schema, ctx)
        ctx.body = await emojiService.getEmojiPkg()
    }

    

    static async getMyEmojiPkg (ctx) {
        ctx.param['openId'] = ctx.session.openId
        const opts = ctx.param
        console.log('ctx.param=====>', ctx.param)
        const schema = {
            openId: Joi.string().required().error(new AppError('openId错误')),
            emojiPkgId: Joi.string()
        }
        const emojiService = new EmojiService(opts, schema, ctx)
        ctx.body = await emojiService.getMyEmojiPkg()
    }

    static async homePage (ctx) {
        const emojiService = new EmojiService({}, {}, ctx)
        ctx.body = await emojiService.homePage()
        // console.log('ctx.body=====>', ctx.body)
    }

    static async upload (ctx) {
        ctx.param['openId'] = ctx.session.openId
        let opts = ctx.param
        const schema = {
            openId: Joi.string().required().error(new AppError('openId错误')),
            emojiPkgId: Joi.string(),
            emojiPkg: Joi.string().required().error(new AppError('emojiPkg错误')),
            tags: Joi.string().required().error(new AppError('tags错误')),
            desc: Joi.string().allow(''),
            imgfiles: Joi.array().required().error(new AppError('file错误')),
        }
        console.log('#upload=>ctx param: ', ctx.param)
        const emojiService = new EmojiService(opts, schema, ctx)
        ctx.body = await emojiService.upload()

    }

    static async manualUpload (ctx) {
        const emojiService = new EmojiService({}, {}, ctx)
        ctx.body = await emojiService.manualUpload()
    }

    static async getTags (ctx) {
        const emojiService = new EmojiService({}, {}, ctx)
        ctx.body = await emojiService.getTags()
    }


    static async fixfilepath (ctx) {
        const emojiService = new EmojiService({}, {}, ctx)
        ctx.body = await emojiService.fixfilepath()
    }

    static async setStar (ctx) {
        ctx.param['openId'] = ctx.session.openId
        const schema = {
            openId: Joi.string().required().error(new AppError('openId错误')),
            emojiPkgId: Joi.string().required().error(new AppError('emojiPkgId错误')),
        }
        const emojiService = new EmojiService(opts, schema, ctx)
        ctx.body = await emojiService.setStar()
    }

    static async setBookMark (ctx) {
        ctx.param['openId'] = ctx.session.openId
        const schema = {
            openId: Joi.string().required().error(new AppError('openId错误')),
            emojiPkgId: Joi.string().required().error(new AppError('emojiPkgId错误')),
            state: Joi.string().valid('set', 'cancel').default('set')
        }
        const emojiService = new EmojiService(opts, schema, ctx)
        ctx.body = await emojiService.setBookMark()
    }

    static async getBookMark (ctx) {
        
    }
    

    static async evidenceSend (ctx) {

        console.log('ctx.params==>', ctx.params)
        const schema = {
            saveEvidenceNumber: Joi.string().required().error(new AppError('saveEvidenceNumber错误'))
        }

        const value = Joi.validate(ctx.params, schema);
        console.log('value==>', value)
        const fileRoot = path.join(__dirname, '../../images/');
        
        const fileName = value.value.saveEvidenceNumber + '.png'
        console.log('fileName==>', fileName)
        ctx.attachment(fileName)
        await send(ctx, fileName, { root: fileRoot });
        // await send(ctx, fs.createReadStream('/Users/JC/Documents/project/grg_blockchain/emoji-server/images/upload_82114aae0f97cfd71c796e61b4ce881d.txt'))
        // const emojiService = new EmojiService({}, {}, ctx)
        // ctx.body = await emojiService.evidenceSend()
    }

}


module.exports = Emoji;