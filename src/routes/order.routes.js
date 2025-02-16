const { Router } = require('express')

const OrderController = require('../controllers/order_controller')
const ensureAuthenticated = require('../middlewares/ensure_authenticated')
const ensureUserIsAdmin = require('../middlewares/ensure_user_is_admin')

const orderController = new OrderController()

const orderRoutes = Router()

orderRoutes.use(ensureAuthenticated)

orderRoutes.post('/', orderController.create)
orderRoutes.get('/', orderController.index)
orderRoutes.put('/:id',ensureUserIsAdmin, orderController.update)

module.exports = orderRoutes;