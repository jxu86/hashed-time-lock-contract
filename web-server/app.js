const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session');
const path = require("path")
const {router, routerOutside} = require('./app/router')
const { queryAndBodyToParam } = require('./app/middleware');
// const fileConfig = require('config').get("file")
// initializer
// require('./config/initializer')
var koaBody = require('koa-body')()

// error handler
onerror(app)


app.use(koaBody)
app.use(bodyparser({}))
app.use(json())

app.use(queryAndBodyToParam)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  console.log(`${JSON.stringify(ctx.body)}`)
})


// routes
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
