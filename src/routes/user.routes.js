const { Router } = require('express')
const UserController = require('../controllers/user_controller')
const ensureController = require('../middlewares/ensure_authenticated')
const AvatarController = require('../controllers/avatar_controller')
const multer = require('multer')
const uploadConfig = require('../configs/uploads')

const userController = new UserController()
const avatarController = new AvatarController()

const userRoutes = Router()
const upload = multer(uploadConfig.MULTER)

userRoutes.post('/', userController.create)
userRoutes.put('/',ensureController, userController.update)
userRoutes.patch('/avatar', ensureController, upload.single('avatar'), avatarController.update)

module.exports = userRoutes;