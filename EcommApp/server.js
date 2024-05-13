// 1. Import Express
import "./env.js";
import express from 'express';
import swagger from 'swagger-ui-express';
import cors from 'cors';
// import dotenv from 'dotenv';
// // load all the environment variables in application
// dotenv.config();

import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartItemRouter from './src/features/cart/cartItems.routes.js';
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
// import apiDocs from './swagger.json'  assert { type: 'json' };

// 2. Create Server
const server = express();



// CORS policy configuration
// server.use((req,res)=>{
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5500');
//     // res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     // res.header('Access-Control-Allow-Headers', '*');
//     res.header('Access-Control-Allow-Methods', '*');
//     // return ok for preflight request
//     if(req.method=="OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })
var corsOptions = {
    origin:'http://localhost:5500'
}
server.use(cors(corsOptions));
server.use(express.json());

// server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

server.use(loggerMiddleware);

// for all request related to product, redirect to product routes.
server.use("/api/orders", jwtAuth, orderRouter)
server.use("/api/products",jwtAuth, productRouter );
server.use("/api/cartItems",loggerMiddleware, jwtAuth, cartItemRouter );
server.use("/api/users", userRouter )

// 3. Default request handler
server.get("/", (req,res)=>{
    res.send("Welcome to ECommerce APIs")
})

//  Errors handler middleware
server.use((err, req, res, next)=>{
    console.log(err);

    if(err instanceof mongoose.Error.ValidationError){
        return res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
        return res.status(err.code).send(err.message);
    }

    // server errors.
    res.status(500).send("Something went wrong, please try later!!!")
})

// 4. Middleware to handle 404 request
server.use((req,res)=>{
    res.status(404).send("API not found");
}) 


// 5. Specify port.
server.listen(3200,()=>{
    console.log("Server is running at 3200");
    connectToMongoDB();
    connectUsingMongoose();
});
