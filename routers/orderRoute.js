const { OrderItems } = require("../Models/OrderItems");
const { Order } = require("../Models/Order");

const express = require("express");
const router = express.Router();
const mongose = require("mongoose");

router.post(``, async(req, res) => {
      const orderItemIds =Promise.all(req.body.orderItems.map(async orderItemId =>{
            let newOrderItem = new OrderItems({
                  productId:orderItemId.productId,
                  quantity:orderItemId.quantity
            })

           let newOrderItems = await newOrderItem.save()
            return newOrderItems._id
      }))

      //there are too many Promise thats why we use Promise.all
      //and resolved it
      const orderItemsIdsResolved = await orderItemIds;
  
      const order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user

      });

      order
        .save()
        .then((createdorder) => {
          res.status(201).json(createdorder);
        })
        .catch((err) => {
          res.status(400).send({success:false,error: err.message});
        });
    });

    module.exports = router;