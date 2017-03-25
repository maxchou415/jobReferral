const router = require('koa-router')()

const services = require('../services/index')
const mongoose = require('mongoose')
const config = require('config')

const appName = config.get('name.appName')
const companyName = config.get('name.companyName')


// Database
const User = require('../models/usersSchema')
mongoose.Promise = global.Promise

router.get('/', (ctx, next) => {
  ctx.body = 'this a users response!'
})

router.get('/signup', async (ctx, next) => {
  ctx.render('users/signup', {

  })
})

router.get('/signin', async (ctx, next) => {
  ctx.state = {
    title: `Sign In to ${appName}`,
    appName: appName
  }
  await ctx.render('users/signin')
})
router.post('/signin', async (ctx, next) => {
  let email = ctx.request.body.email
  let password = ctx.request.body.password

  let passwordProcessResult = await services.passwordHash(password)

  try {
    let login = await User.findOne({'email': email})
    if(login.password !== passwordProcessResult) {
      ctx.send(401, { message: 'Password Incorrent'})
    } else {
      let session = await services.sessionGenerator(login)
      ctx.session.user = session
      ctx.state = {
        title: `Dashboard | ${appName}`
      }
      switch (login.role) {
        case 1:
          // admin
          await ctx.redirect('/dashboard')
          break
        case 2:
          // hr
          await ctx.redirect('/dashboard')
          break
        case 3:
          // staff
          await ctx.redirect('/dashboard')
          break
      }
    }
  } catch (e) {
    ctx.send(404, { message: 'User not found' })
  }
})

router.post('/signup', async (ctx, next) => {

  let name = ctx.request.body.name
  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let email = ctx.request.body.email

  let passwordResult = await services.passwordHash(password)

  let newUser = {
    name: name,
    username: username,
    password: passwordResult,
    email: email
  }

  try {
    let createUser = await User.create(newUser)
    ctx.send(200, { message: 'User has been created' })
  } catch (e) {
    ctx.send(400, { message: 'Create User Failed' })
  }
})

router.get('/lists', async (ctx, next) => {
  let users = await User.find({})
  ctx.body = users
})


module.exports = router
