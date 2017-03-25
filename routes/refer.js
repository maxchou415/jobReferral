const router = require('koa-router')()
const config = require('config')

const Refer = require('../models/referSchema')

const companyName = config.get('name.companyName')

router.get('/create', isLoggedIn, async function (ctx, next) {
  let userId = ctx.session.user.id
  console.log(userId)
  ctx.state = {
    title: `Create a Refer`,
    companyName: companyName
  }
  await ctx.render('refer/create')
})

router.post('/create', isLoggedIn, async function (ctx, next) {
  let name = ctx.request.body.name
  let promoMessage = ctx.request.promoMessage
  let resumeUrl = ctx.request.body.url
  let position = ctx.request.body.position
  let userId = ctx.session.user.id

  let referInfo = {
    name: name,
    promoMessage: promoMessage,
    resumeUrl: resumeUrl,
    position: position,
    created_by: userId
  }

  try {
    let createRefer = await Refer.create(referInfo)
    console.log(createRefer)
  } catch (e) {
    console.log(e)
  }

})

async function isLoggedIn (ctx, next) {
  let userSession = ctx.session.user
  if(!userSession) {
    await ctx.redirect('/users/signin')
  }
  await next()
}

module.exports = router
