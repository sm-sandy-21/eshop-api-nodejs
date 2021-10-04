const mongose = require("mongoose");

const categorySchema = mongose.Schema({
      name: { type:String , required: true},
      icon: { type:String , default:''},
    });
    
exports.Category = mongose.model("Category", categorySchema);