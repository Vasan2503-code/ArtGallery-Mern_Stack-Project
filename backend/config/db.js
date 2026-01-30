const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected successfully");
    }
    catch(e){
        console.log("Error in connecting db" , e);
        
    }
}

module.exports = connectDB;