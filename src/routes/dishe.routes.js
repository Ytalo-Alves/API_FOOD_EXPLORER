const { Router } = require('express')
const uploadConfig = require('../configs/uploads')
const multer = require('multer')

const DishesController = require('../controllers/dishe_controller')
const ensureAuthenticated = require('../middlewares/ensure_authenticated')

const dishesController = new DishesController()

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post('/', upload.single('image'), dishesController.create)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.delete('/:id', dishesController.delete)

module.exports = dishesRoutes;