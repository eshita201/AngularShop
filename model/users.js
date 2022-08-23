const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    email: { 
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    isAdmin: {
        type:String
    },
    totalAmount :{
        type: Number},
    address :{
        type:String
    }  

})
const Users = mongoose.model('users',UserSchema) 
module.exports = Users
