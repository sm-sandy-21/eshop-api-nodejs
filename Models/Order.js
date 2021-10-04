const mongose = require("mongoose");

const OrderSchema = mongose.Schema({
      orderItems:[{
            type:mongose.Schema.Types.ObjectId,
            ref:'OrderItems',
            require:true
      }],
      shippingAddress1:{
            type:String,
            require:true
      },
      shippingAddress2:{
            type:String
      },
      city:{
            type:String,
            require:true
      },
      zip:{
            type:String,
            require:true
      },
      country:{
            type:String,
            require:true
      },
      phone:{
            type:String,
            require:true
      },
      status:{
            type:String,
            require:true,
            default:'Pending'
      },
      totalPrice:{
            type:Number,
            require:true
      },
      user:{
            type:mongose.Schema.Types.ObjectId,
            ref:'User',
            require:true
      },
      orderDate:{
            type:Date,
            default:Date.now
      },
      
    });
    
exports.Order = mongose.model("Order", OrderSchema);