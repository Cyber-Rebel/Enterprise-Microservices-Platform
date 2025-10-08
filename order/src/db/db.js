const mongoose = require('mongoose');


const db = async ()=>{
   await mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("DB connected")
   }).catch((err)=>{
    console.log(err)
   })   
}
module.exports = db;