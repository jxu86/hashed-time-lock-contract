
const Htlc = require('./controller/htlc');
const router = require('koa-router')({ prefix: '/api/v1', sensitive: true });
const { responseFormatter } = require('./middleware')
router.use('/', responseFormatter('^/api'));

router.get('/htlc/test', Htlc.test);

module.exports = {
    router: router,
}
