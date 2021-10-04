const { OrderItems } = require("../Models/OrderItems");
const { Order } = require("../Models/Order");

const express = require("express");
const router = express.Router();
const mongose = require("mongoose");

router.get(``, async (req, res) => {
  const order = await Order.find()
    .populate("user", "name email")
    .sort({ orderDate: -1 });
  if (!order) {
    res.status(404).send({ success: false, error: err.message });
  }
  res.status(201).json(order);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    //Popolate Product Id into the orderItems Array && category populate unto productId object
    .populate({
      path: "orderItems",
      populate: { path: "productId", populate: "category" },
    });
  if (!order) {
    res.status(404).send({ success: false, error: err.message });
  }
  res.status(201).json(order);
});

router.post(``, async (req, res) => {
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (orderItemId) => {
      let newOrderItem = new OrderItems({
        productId: orderItemId.productId,
        quantity: orderItemId.quantity,
      });

      let newOrderItems = await newOrderItem.save();
      return newOrderItems._id;
    })
  );

  //there are too many Promise thats why we use Promise.all
  //and resolved it
  const orderItemsIdsResolved = await orderItemIds;

  const totalPrice = await Promise.all(
    orderItemsIdsResolved.map(async (item) => {
      const res = await OrderItems.findById(item).populate(
        "productId",
        "price"
      );
      // console.log("price",res.productId.price)
      // console.log("quantity",res.quantity )
      const total = res.productId.price * res.quantity;
      // console.log("total",total)

      return total;
    })
  );

  // console.log("priceAray",totalPrice)
  const totalPrices = totalPrice.reduce((a, b) => a + b, 0);

  // console.log("price",totalPrices)
  const order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrices,
    user: req.body.user,
  });

  order
    .save()
    .then((createdorder) => {
      res.status(201).json(createdorder);
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err.message });
    });
});

router.put("/:id", (req, res) => {
  Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  )
    .then((updateCate) => {
      res.status(201).json(updateCate);
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err.message });
    });
});

router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then((item) => {
      item.orderItems.map(async (sigleItem) => {
        await OrderItems.findByIdAndRemove(sigleItem);
      });

      res.status(201).json("Order Delete Sucessfully");
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err.message });
    });
});

router.get("/get/totalsales", (req, res) => {
  Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ])
    .then((totalSales) => {
      res.send({ totalSales: totalSales });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get('/get/count', async (req, res) => {
  const order = await Order.countDocuments()
  if (!order) {
    res.status(404).json("order Not Availabe");
  }
  res.status(201).send({orderCount: order});
});


router.get('/get/userOrder/:userId', async (req, res) => {

  const order = await Order.find({user:req.params.userId})
  .populate({
    path: "orderItems",
    populate: { path: "productId", populate: "category" },
  })
    .sort({ orderDate: -1 });
  if (!order) {
    res.status(404).send({ success: false, error: err.message });
  }
  res.status(201).json(order);
});

module.exports = router;
