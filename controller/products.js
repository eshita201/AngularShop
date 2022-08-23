const Products = require('../model/products')

exports.fetchproducts = (req,res)=>{

    Products.find().then(product=>{
       // console.log("check  =    ", product);
        res.status(201).json({product})
    }).catch(err=>{
        res.status(500).send({message: err.message || 'Error has occured'});
   
        
    })

}

exports.fetchproductsbyid = (req,res)=>{

    Products.findById(req.params.id).then(data=>{
        if(!data){
            res.status(404).send({ message : "Not found product with id "+ id})
        }else{
           res.send(data)     
        }
    }).catch(err=>{
        res.status(500).send({message: err.message || 'Error has occured'});
    })

}

exports.addproducts = (req,res,next)=>{
    const url = req.protocol + '://' + req.get("host");
    console.log('Reached here @ 29'," test"," " , JSON.stringify(req.body))
        const product =new Products({
        Name: req.body.Name,
        Price: req.body.Price,
        Category: req.body.Category,
       // Image: req.file.path
        Image:    "public/" + req.file.filename
    });
  //  console.log('Reached here @ 36', req.body.Name , " ", req.body.Price , " ",req.body.Category)
    console.log('Reached here @ 40 ',  req.file)
   
    product.save().then(product=>{
     //   res.send('Product Added');
        res.status(201).json({
            message: "Product Added successfully"
           // products:  product
         });

    }).catch(err=>{
        
        res.status(500).send({message: err.message || 'Error has occured'});
    })

}


exports.updateproductswithoutimage = async (req,res) =>{
    const id = req.params.id
    const product_1 = await Products.findOne({id}).lean()
  const product = new Products({
        _id: req.params.id,
        Name: req.body.Name,
        Price: req.body.Price,
     Category: req.body.Category
   //  Image: product_1.Image
     });

   ///console.log("checking product_1 by id := ", product_1 );
   console.log("checking product by id := ",product );
  Products.updateOne({_id: req.params.id},product)
    .then(data=>{
        if(!data){
            res.status(404).send({ message : `Cannot Update product with ${id}. Maybe product not found!`})
        }else{
            res.send(data)
        }
    })
    .catch(err=>{
        console.log('some error has occured ');
        //res.status.send(err)
    })

}


exports.updateproducts = (req,res)=>{
    const id = req.params.id
    const url = req.protocol + '://' + req.get("host");
   
    let imagePath = req.body.imagePath;

    console.log("checkimg image file " , req.file , ' filename := ', req.file.filename );

    if(req.file){
        imagePath:    "/public/" + req.file.filename
        console.log('file is present  ', url + "/public/" + req.file.filename)
    }
    else{
        console.log('file isnt prsent')
    }

    const product = new Products({
        _id: req.params.id,
        Name: req.body.Name,
        Price: req.body.Price,
     Category: req.body.Category,
     Image:"public/" + req.file.filename
     });
    console.log("Product is 80 := ", product)
    Products.updateOne({_id: req.params.id},product)
    .then(data=>{
        if(!data){
            res.status(404).send({ message : `Cannot Update product with ${id}. Maybe product not found!`})
        }else{
            res.send(data)
        }
    })
    .catch(err=>{
        console.log('some error has occured ');
        //res.status.send(err)
    })

}

exports.deleteproducts = (req,res)=>{
    const id = req.params.id;
    console.log(" deleting products from server database:= ", id)
   Products.findByIdAndDelete(id).then(data=>
        {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Product was deleted successfully!"
                })
            }
        })
        .catch(err=>{
            req.send(500).send({
                message:"Could not delete {Product} with id=" + id
            })
        })
    
}