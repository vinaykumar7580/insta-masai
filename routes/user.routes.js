const express=require("express")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const { UserModel } = require("../model/user.model")

const userRouter=express.Router()

userRouter.post("/register", async(req,res)=>{
    const {name, email, gender, password, age, city, is_married}=req.body
    let user=await UserModel.findOne({email})
    try{
        if(user){
            res.status(200).send({msg:"User already exist, please login"})
        }else{
            bcrypt.hash(password, 5, async(err, hash)=>{
                if(hash){
                    let user=new UserModel({name,email,gender,password:hash,age,city,is_married})
                    await user.save()
                    res.status(200).send({msg:"register successfull!"})
                }else{
                    res.status(400).send({msg:"register failed!"})
                }
            });
        }
       

    }catch(err){
        res.status(400).send(err)
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    let user=await UserModel.findOne({email})
    try{
        bcrypt.compare(password, user.password, async(err, result)=> {
            if(result){
                const token = jwt.sign({userID:user._id}, 'masai');
                res.status(200).send({msg:"login successfull!",token})
            }else{
                res.status(400).send({msg:"login failed!"})
            }
            
        });

    }catch(err){
        res.status(400).send(err)
    }
})

//var decoded = jwt.verify(token, 'shhhhh');

module.exports={userRouter}