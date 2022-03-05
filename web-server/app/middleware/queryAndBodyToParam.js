const _ = require('lodash');
const uuid = require('uuid');

module.exports = async (ctx, next) => {
  if (ctx.request.files) {
    files = ctx.request.files
    ctx.request.body['imgfiles'] = []
    Object.keys(files).forEach(e => {
      ctx.request.body['imgfiles'].push({
        "path": files[e]['path'],
        "name": e,
        "type": files[e]['type'],
      })
    });
  }
  ctx.param = _.extend({}, ctx.query, ctx.request.body);
  ctx.state.requestId = uuid.v4();
  ctx.state.clientIp = ctx.ip.split(':')[3] || ctx.ip;
  await next();
};
