const express = require("express")
const routes = express.Router();

const Cartcontroller = require("../controller/CartController")
const { middleWare } = require("../middleware/AuthMiddle")

routes.post("/add-cart" , middleWare , Cartcontroller.addCart)
routes.delete("/delete-item" , middleWare , Cartcontroller.deleteCartItem)
routes.get("/get-cart" , middleWare , Cartcontroller.getCart)

module.exports = routes
