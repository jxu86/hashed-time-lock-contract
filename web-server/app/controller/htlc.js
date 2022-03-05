
const { log, AppError } = require('../lib')
const Joi = require('joi')
const path = require('path')
const send = require('koa-send')
const fs = require('fs')
class Htlc {



    static async test (ctx) {
        ctx.body = "test ok"
    }



    // static async getTags (ctx) {
    //     const emojiService = new EmojiService({}, {}, ctx)
    //     ctx.body = await emojiService.getTags()
    // }



    

}


module.exports = Htlc;