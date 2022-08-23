const express = require('express')
const cors = require('cors')
const http = require('http');
const debug = require("debug")("node-angular");
app=express();
const bodyparser =require('body-parser') 
const dotenv = require('dotenv')
const path = require('path')
const products = require('./routes/products.js')
const users = require('./routes/users.js')
const cart = require('./routes/cart.js')
const Razorpay = require('razorpay');
const connectDb = require('./database/connection');
const Users = require('./model/users.js');
connectDb();
dotenv.config({path: 'config.env'})
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
var instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});
app.use(cors());
/*
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});*/


  app.use('/public', express.static('public'))
  app.use('/api/products',products);
  app.use('/api/users',users);
  app.use('/api/cart',cart);
  app.use('/api/createorder',(req,res)=>{


    ///console.log("checking order data ",req.body);


      var options = {
        amount: req.body.price *  100,
        currency: 'INR',
    };


   instance.orders.create(options, function (err, order) {
        if (err) {
            console.log(err);
            res.status(500).send({message: err.message || 'Error has occured'});
   
        } else {
            console.log(order);
            //res.send( order );
           
            
           
            res.status(200).send({order: order.id,
            userid: req.body.userid, amount: req.body.price});
   
        }
    });




  });

  app.use( express.static(__dirname + '/dist/frontend'));
  const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  };
  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
  };
  const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port,()=> { console.log(`App is listening on PORT http://localhost:${port}`)});



