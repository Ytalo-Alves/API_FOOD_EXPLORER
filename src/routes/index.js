const { Router } = require('express')

const userRouter = require('./user.routes')
const sessionRouter = require('./session.routes')
const dishesRoutes = require('./dishe.routes')

const routes = Router()

routes.use('/users', userRouter)
routes.use('/session', sessionRouter)
routes.use('/dishes', dishesRoutes)

module.exports = routes