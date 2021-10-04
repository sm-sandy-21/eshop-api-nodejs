const mongose = require("mongoose");

const productSchema = mongose.Schema({
      name: { type:String , required: true},
      desciption: { type:String , required: true},
      richDesc: { type:String },
      image:{ type:String , required: true},
      images:[{
        type:String
      }],
      brand:String,
      price:{ type:Number , required: true,default:''},
      category:{
        type:mongose.Schema.Types.ObjectId,
        ref:'Category',
        require: true
      },
      countInStock:{
        type:Number,
        require:true,
        min:0,
        max:255
      },
      isFeatured:{
        type:Boolean,
        default:false
      },
      dateCreated:{
        type:Date,
        default:Date.now
      }

    })

    //Changing the default _id to only id...........add extra same id filed
    productSchema.virtual('id').get(function () {
      return this._id.toHexString();
    })
    productSchema.set('toJSON',{
      virtuals:true
    })
    
exports.Product = mongose.model("Product", productSchema);