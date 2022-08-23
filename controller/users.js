const Users = require('../model/users')
const bcrypt = require("bcryptjs")
const jwt =require('jsonwebtoken');
const dotenv =require('dotenv')
dotenv.config({path : 'config.env'})

exports.signuser = (req,res)=>{

    console.log("signup user",req.body);
    
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new Users({
            email: req.body.email,
            password: hash,
            isAdmin: 'N',
            totalAmount: 0,
            address: req.body.address
        });
        user.save().then(result=>{
            res.status(201).json({
                message: 'User created!',
                result: result
            });
        }).catch(err=>{
            return res.status(500).json({
                message: "User already exists"
            });
        });
    });

}

exports.loginuser = async(req,res)=>{

    console.log("logging in ", req.body);
    const email= req.body.email;
    const pass = req.body.password;
    const user = await Users.findOne({email}).lean()
    console.log("isadmin check ",user.isAdmin);
    if(user){
        console.log("Email exists");
        if(await bcrypt.compare(pass,user.password)){
            //console.log("user matched", process.env.JWT_TOKEN);
            const token = jwt.sign({email:user.email,
                userid:user._id},
                process.env.JWT_TOKEN,
                {expiresIn: "1h" } 
            ); 
            //console.log("token:= ", token);

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId:user._id,
                isAdmin: user.isAdmin
            });

        }else{
            /*return res.status(401).json({
                message: "Auth failed Password does not match"
            });*/
            console.log("user not matched");
        }
    }else{
         return res.status(401).json({
                        message: "Auth failed"
                    });
        }

}

exports.getUserByid = (req,res)=>{
    //console.log("userid testing ",req.params.id)
    const id= req.params.id;
    Users.findById(req.params.id).then(data=>{
        if(!data){
            res.status(404).send({ message : "Not found user with id "+ id})
        }else{
           res.send(data)     
        }
    }).catch(err=>{
        res.status(500).send({message: err.message || 'Error has occured'});
    })


    }
