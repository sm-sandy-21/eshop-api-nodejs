const mongose = require("mongoose");

const OrderItemsSchema = mongose.Schema({
      productId:{
            type: mongose.Schema.Types.ObjectId,
            ref:"Product",
            require:true
      },
      quantity:{
            type:Number,
            require:true
      }
    });
    
exports.OrderItems = mongose.model("OrderItems", OrderItemsSchema);