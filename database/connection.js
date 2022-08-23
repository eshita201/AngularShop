const mongoose = require('mongoose');
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: 'config.env'})
const MONGO_URI = process.env.MONGO_URI;

const connectDb = async =>{ 
 
  const con = mongoose.connect(MONGO_URI,err=>{
        if (err) throw err;
        console.log('Connection to shopping database is successful')
    });

};

module.exports = connectDb;