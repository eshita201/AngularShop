const mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({
    Name:{
        type: String,
        required: true,
        unique: true
    },
    Price:{
        type: Number,
        required: true
    },
    Category:{
        type: String,
        required: true
    },
    Image :{
       
        type: String,
       // required: true
    }
})

const Products = mongoose.model('products',ProductSchema);
module.exports = Products; 