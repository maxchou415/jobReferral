const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')
const mongoose = require('mongoose')
const session = require('koa-generic-session')
const passport = require('koa-passport')
const config = require('config')
const respond = require('koa-respond')

app.keys = config.get('secret.session')
app.use(convert(session()))

const index = require('./routes/index')
const users = require('./routes/users')
const apis = require('./routes/apis')

// database
mongoose.Promise = global.Promise

// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
app.use(respond())
app.use(require('koa-static')(__dirname + '/public'))

// auth
app.use(passport.initialize())
app.use(passport.session())

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

router.use('/', index.routes(), index.allowedMethods())
router.use('/users', users.routes(), users.allowedMethods())
router.use('/api', apis.routes(), apis.allowedMethods())

app.use(router.routes(), router.allowedMethods())
// response

app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx)
})


module.exports = app
