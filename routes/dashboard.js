const router = require('koa-router')()
const config = require('config')
const companyName = config.get('name.companyName')

router.get('/', isLoggedIn, async function (ctx, next) {
  let userRole = ctx.session.user.role

  ctx.state = {
    title: `Dashboard | ${companyName}`,
    companyName: companyName
  }

  switch (userRole) {
    case 1:
      await ctx.render('dashboard/admin')
      break
    case 2:
      await ctx.render('dashboard/hr')
      break
    case 3:
      await ctx.render('dashboard/staff')
      break
  }
})

async function isLoggedIn (ctx, next) {
  let userSession = ctx.session.user
  console.log(ctx.session)
  if(!userSession || userSession == undefined) {
    await ctx.redirect('/users/signin')
  }
  await next()
}
module.exports = router
