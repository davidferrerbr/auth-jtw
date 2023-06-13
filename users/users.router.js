const express = require("express");
const controller = require("./users.controller");
const checkToken = require("../middleware/middleware")

const router = express.Router();

router.get("/", controller.findAll);
// checkToken
 router.get("/:id", checkToken, controller.findById);

module.exports = router;