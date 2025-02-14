const { Router } = require("express");
const SessionController = require("../controllers/session_controller");

const sessionController = new SessionController();
const sessionRoutes = Router();

sessionRoutes.post("/", sessionController.create);

module.exports = sessionRoutes;
