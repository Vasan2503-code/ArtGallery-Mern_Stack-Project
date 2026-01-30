const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    items:[{
        art : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Art",
            required : true
        },
        quantity : {
            type : Number,
            default : 1,
            required : true
        }
    }]
})

module.exports = mongoose.model("Cart" , cartSchema);