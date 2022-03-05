
const Emoji = require('./controller/emoji');
const router = require('koa-router')({ prefix: '/api/v1', sensitive: true });
const routerOutside = require('koa-router')({ prefix: '/v1', sensitive: true });
const { responseFormatter } = require('./middleware')
router.use('/', responseFormatter('^/api'));


// /**
//  * 登录凭证校验
//  * @api {POST} /wechat/user/code2Session 登录凭证校验
//  * @apiDescription 登录凭证校验
//  * @apiName code2Session
//  * @apiParam {String} code 微信临时登录凭证 
//  * @apiSuccess {Number} code 0 代表成功，非 0 则表示失败
//  * @apiSuccess {Object} message  提示信息
//  * @apiSuccessExample {json} Success-Response:
//  *    HTTP/1.1 200 OK
//  *    {
//  *      "code": 0,
//  *      "data": {
//  *          "wstoken": "XXXXXXXX"
//  *      }
//  *    }
//  * @apiGroup WeChat
//  */
// router.post('/wechat/user/code2Session', opRecord, User.code2Session);


// /**
//  * 微信用户上传表情包
//  * @api {POST} /wechat/emoji/upload 微信用户上传表情包
//  * @apiDescription 微信用户上传表情包
//  * @apiName upload
//  * @apiParam {String} emojiPkgId 表现包名字,非必须
//  * @apiParam {String} emojiPkg 表现包名字
//  * @apiParam {String} tags 标签,分号隔开，如 “可爱;中国风;迷人”
//  * @apiParam {String} desc 描述
//  * @apiParam {String} file1 表情名字1 文件
//  * @apiParam {String} file2 表情名字2 文件
//  * @apiSuccess {Number} code 0 代表成功，非 0 则表示失败
//  * @apiSuccess {String} message  提示信息
//  * @apiSuccessExample {json} Success-Response:
//  *    HTTP/1.1 200 OK
//  *    {
//  *      "code": 0,
//  *      "data": {
//  *          "emojiPkgId": "XXXXXXXXX"
//  *      }
//  *    }
//  * @apiGroup WeChat
//  */
// router.post('/wechat/emoji/upload', opRecord, requestAuthentication, Emoji.upload);

// router.post('/wechat/emoji/manualUpload', requestAuthentication, Emoji.manualUpload);


// /**
//  * 获取表情包列表
//  * @api {GET} /wechat/emoji/getList 获取表情包列表
//  * @apiDescription 获取表情包列表
//  * @apiName getList
//  * @apiParam {String} type 类型，'banner','newest','hot','openId'
//  * @apiSuccess {Number} code 0 代表成功，非 0 则表示失败
//  * @apiSuccess {List} data  表情包信息
//  * @apiSuccessExample {json} Success-Response:
//  *    HTTP/1.1 200 OK
//  *    {
//  *      "code": 0,
//  *      "data": [
//  *          {
//  *               openId: 'oHJ0d5NI6xMzNjv4da2PYRVzHUs4',
//  *               emojiName: '关羽1',
//  *               filePath: 'http://q3od7o06m.bkt.clouddn.com/关羽_1.png',
//  *               tags: [ '中国风', '春节' ],
//  *               desc: '描述:关羽门神'
//  *           },
//  *           {
//  *               openId: 'oHJ0d5NI6xMzNjv4da2PYRVzHUs4',
//  *               emojiName: '关羽2',
//  *               filePath: 'http://q3od7o06m.bkt.clouddn.com/关羽_1.png',
//  *               tags: [ '中国风', '春节' ],
//  *               desc: '描述:关羽门神'
//  *           }
//  *      ]
//  *    }
//  * @apiGroup WeChat
//  */
// router.get('/wechat/emoji/getList', Emoji.getList);

module.exports = {
    router: router,
}
