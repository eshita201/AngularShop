const Products = require('../model/products')
const Users = require('../model/users')
const Cart = require('../model/cart')
exports.addproductstocart = async (req,res)=>{
    const userId=req.body.userid;
    const productId =req.body.productId
    var Pquantity=1;
    var user = await Users.findOne({ _id: userId }).lean()
    var product = await Products.findOne({ _id: productId }).lean()
    const Checkcart = await Cart.findOne({productId : product._id , 
        userid: req.body.userid,
        Deliverystatus: ''}).lean()
    if(Checkcart){
        Pquantity =  parseInt(1 + Checkcart.quantity) ;
    }else{
        Pquantity = 1;
    }
    console.log("user",user);
    console.log("check the value in user ", user.totalAmount)
    let totalAmount = user.totalAmount;
    console.log(Pquantity,", ", product.Price ," , " ,product.Price + totalAmount );
    let updateAmount = {$set : {totalAmount: product.Price + totalAmount   }};
   
    const cart =new Cart({
        productId: product._id,
        productName: product.Name,
        quantity: Pquantity,
        price: product.Price,
        userid: user._id,
        useremail: user.email,
        productImage:product.Image,
        paymentStatus: '',
        orderId: '',
        Deliverystatus: ''
        //paymentId:product. 
    });
       
         if(Checkcart){  
           //console.log("cart data 11 := ", Checkcart._id);
           let updateQuantity = {$set : {quantity: Pquantity}};
           Cart.updateOne({_id: Checkcart._id},updateQuantity)
            .then(data=>{
                if(!data){
                    res.status(404).send({ message : `Cannot Update product with  Maybe product not found!`})
                }else{
                    let updateAmount = {$set : {totalAmount:product.Price   + totalAmount }};
   
                  Users.updateOne({_id:user._id},updateAmount).then(data=>{
                        if(!data){
                            //res.status(404).send({ message : `Cannot Update user with  Maybe user not found!`})
                        }else{
                            console.log("product amount updated")
                           // res.send(data)
                        }
                    }) 
                   // console.log("Update the user value", updateAmount);
                    res.send(data)
                }
            })
            .catch(err=>{
                console.log('some error has occured ',err);
                res.status(404).send({ message : `Cannot Update product with`})
            
            })
        


        }else{    
            cart.save().then(cart=>{

             
                console.log("Update the user value", updateAmount);

                res.status(201).json({
                    message: "Product Added to the cart successfully"
                });
            }).catch(err=>{ 
                res.status(500).send({message: err.message || 'Error has occured'});
            })
            let updateAmount = {$set : {totalAmount: product.Price  +totalAmount  }};
   
            Users.updateOne({_id:user._id},updateAmount).then(data=>{
                if(!data){
             }else{
                    console.log("product amount updated")
                }
            })   

        }


}

exports.productsfromcart = async (req,res)=>{

    //userid testingconsole.log("check cart data := ", req.params.id);
    const userid = req.params.id;
    //const cart = await Cart.find({userid}).lean()
    //console.log("cart data is := ",cart );
    Cart.find({userid}).then(cart=>{
        // console.log("check  =    ", product);
         res.status(201).json({message: 'fetched data' ,cart: cart})
     }).catch(err=>{
         res.status(500).send({message: err.message || 'Error has occured'});
    
         
     })
 
  // res.status(201).send({ message : " products from  cart",cart: cart  })
   

    /*Cart.findById({userid:id}).then(data=>{
        if(!data){
            res.status(404).send({ message : "Not found cart with id "+ req.params.id})
        }else{
           res.send(data)     
        }
    }).catch(err=>{
        res.status(500).send({message: err.message || 'Error has occured'});
    })*/

    
    
}

exports.updateCart = (req,res)=>{
    console.log("cart update data check:= ", req.body);
    //let CartUpdate = {$set : {quantity: Pquantity}};
    let updateCart = {$set : {paymentStatus: req.body.paymentStatus,
        orderId: req.body.orderId,
        Deliverystatus: req.body.Deliverystatus,
        paymentId: req.body.paymentId}};
    let totalAmount = 0;    
    Cart.updateMany({userid: req.body.userid},updateCart).then(data=>{
        if(!data){
            console.log("cart not updated");
         }else{
            console.log("cart updated");
        }}).catch(err=>{ 
            res.status(500).send({message: err.message || 'Error has occured'});
        })
        let updateUser = {$set : {totalAmount: 0}};  
    Users.updateOne({_id: req.body.userid},updateUser).then(data=>{if(!data){
        console.log("user not updated");
        }else{
            console.log("user updated");
        }}).catch(err=>{
            res.status().send
        })   
}

exports.displayorders = (req,res)=>{
    console.log("Hi I am displaying orders ")
  //  res.status(201).json({message: 'fetched data' ,
   // id: req.params.userid})

    Cart.find({"paymentStatus": 'Paid' , "userid":req.params.userid })   .then(cart => {
        res.send(cart)
    })
    .catch(err => {
        res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
    })


}

exports.deletefromCart =    async(req,res)=>{
   const userid= req.params.userid;
   const productid=  req.params.productid;
   console.log(" usersid productid ",userid , ", ",productid );

   const Checkcart = await Cart.find({productId : req.params.productid , 
    userid: req.params.userid,"paymentStatus": ''}).lean()
    const Checkuser = await Users.find({_id: req.params.userid}).lean()
    console.log("Checkcart:=  ",Checkcart[0].quantity-1);  
   let updatequantity= {$set : {quantity: (Checkcart[0].quantity-1) }};
   let updateAmount= {$set : {totalAmount: (Checkuser[0].totalAmount-Checkcart[0].price) }};
    console.log("check user amount initial",Checkuser[0]);
    console.log("check user amount ",Checkuser[0].totalAmount-Checkcart[0].price);
      
   //console.log("Checkcart type :=  ",typeof(Checkcart[0].quantity-1)); 
   
    if((Checkcart[0].quantity-1)===0){
        Cart.deleteOne({paymentStatus: '' , userid:req.params.userid ,
         productId:  req.params.productid })  .then(cart => {
    //res.send(cart)
    })
    } else {
        Cart.updateOne({paymentStatus: '' , userid:req.params.userid ,
        productId:  req.params.productid },updatequantity)  .then(cart => {
        //res.send(cart)
        })

    } 
   
   
    Users.updateOne({ _id:req.params.userid  },updateAmount)  .then(user => {
     //res.send(cart)
     })
   //res.send({userid, productid})
}