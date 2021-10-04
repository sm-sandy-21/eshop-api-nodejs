const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    default:''
  },
  apartment: {
    type: String,
    default:''
  },
  city: {
    type: String,
    default:''
  },
  zip: {
    type: String,
    default:''
  },
  country: {
    type: String,
    default:''
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
});
 //Changing the default _id to only id...........add extra same id filed
 userSchema.virtual('id').get(function () {
      return this._id.toHexString();
    })
    userSchema.set('toJSON',{
      virtuals:true
    })
    
exports.User = mongoose.model("User", userSchema);
