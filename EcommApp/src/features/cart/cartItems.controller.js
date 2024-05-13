
import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export default class CartItemsController{
    
    constructor(){
        this.cartItemsRepository = new CartItemsRepository();
    }

    async add(req, res){
        try {
            const {productID, quantity} = req.body;
            const userID = req.userID;

            await this.cartItemsRepository.add(productID, userID, quantity);

            res.status(201).send("Cart is updated");
        } catch (error) {
            console.log(error);
            // throw new ApplicationError("Something went wrong", 500);
            return res.status(200).send("Something went wrong")
        }

    }

    async get(req, res){
        try {
            const userID = req.userID;
            const items = await this.cartItemsRepository.get(userID);
            return res.status(200).send(items);
        } catch (error) {
            console.log(error);
            // throw new ApplicationError("Something went wrong", 500);
            return res.status(200).send("Something went wrong")
        }
    }

    async delete(req, res){
        const userID = req.userID;
        const cartItemID = req.params.id;
        const isDeleted = await this.cartItemsRepository.delete(userID, cartItemID);
        if(!isDeleted){
            res.status(404).send("Item not found");
        } else{
            return res.status(200).send('Cart Item is removed');
        }
    }
}