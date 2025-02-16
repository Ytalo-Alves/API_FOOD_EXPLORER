const { Router } = require('express')

const userRouter = require('./user.routes')
const sessionRouter = require('./session.routes')
const dishesRoutes = require('./dishe.routes')
const ordersRoutes = require('./order.routes')

const routes = Router()

routes.use('/users', userRouter)
routes.use('/session', sessionRouter)
routes.use('/dishes', dishesRoutes)
routes.use('/orders', ordersRoutes)

module.exports = routes