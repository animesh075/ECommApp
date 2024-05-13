
// 1. Import express
import express from 'express';
import CartItemsController from './cartItems.controller.js';

// 2. Initialize Express router.
const cartItemRouter = express.Router();

const cartItemController = new CartItemsController();

cartItemRouter.post("/", (req, res, next)=>{
    cartItemController.add(req, res, next)
});
cartItemRouter.get("/", (req, res, next)=>{
    cartItemController.get(req, res, next)
});
cartItemRouter.delete("/:id", (req, res, next)=>{
    cartItemController.delete(req, res, next)
});

export default cartItemRouter;