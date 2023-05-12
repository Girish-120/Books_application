const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:{type:String},
    email:{type:String, unique:true},
    password:{type:String, required: true},
    mobile:{type:Number, unique: true},
    book_item:{type:Number}
})


module.exports = mongoose.model('User', userSchema);