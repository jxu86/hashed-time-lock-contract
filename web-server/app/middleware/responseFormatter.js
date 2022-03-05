const {AppError} = require('../lib');

module.exports = (pattern) => {
    
    return async (ctx, next) => {
        const reg = new RegExp(pattern);
        if (!reg.test(ctx.originalUrl)) {
            await next();
            return;
        }
        try {
            await next();
            ctx.status = 200;
            ctx.body = {
                code: 0,
                data: ctx.body
            };
        } catch (e) {
            if (e instanceof AppError) {
                ctx.status = 200;
                ctx.body = {
                    code: e.code === undefined ? 1 : e.code,
                    msg: e.message
                };
            } else {
                console.log('error==>', e)
                ctx.status = 500;
                ctx.body = {
                    code: -1,
                    msg: 'system error'
                };
            }
        }
    };
};
