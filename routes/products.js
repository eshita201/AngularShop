const express = require('express');
routes = express.Router();
const multer = require('multer');
const controller = require('../controller/products')
const DIR = './public/'
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
     // cb(null, DIR)
     cb(null,  path.join(__dirname,'../public'))
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-')
      cb(null, fileName)
    },
  })
  
  // Multer Mime Type Validation
  var upload = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 5
    // },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) {
        cb(null, true)
      } else {
        cb(null, false)
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
      }
    },
  })

  


routes.get ('',controller.fetchproducts)
routes.get ('/:id',controller.fetchproductsbyid)
routes.post('',upload.single('Image'),controller.addproducts)
routes.put('/withoutimage/:id',controller.updateproductswithoutimage)
routes.put('/:id',upload.single('Image'),controller.updateproducts)
routes.delete('/:id',controller.deleteproducts)
module.exports = routes