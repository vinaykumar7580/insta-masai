const express=require("express");
const { PostModel } = require("../model/post.model");

const postRouter=express.Router()

postRouter.post("/add",async(req,res)=>{
    const payload=req.body;
    try{
        let post=new PostModel(payload)
        await post.save()
        res.status(200).send({msg:"post added!"})

    }catch(err){
        res.status(400).send(err)
    }
})

postRouter.get("/",async(req,res)=>{
    const {min,max,page}=req.query;
    const {userID}=req.body;

    const newPage=(page-1)*3

    let map={}
    if(min){
        map.no_of_comments={$gte:min}
    }
    if(max){
        map.no_of_comments.$lte=max
    }

    try{
        let post=await PostModel.find({userID:userID},map).skip(newPage).limit(3)
        res.status(200).send({msg:post})

    }catch(err){
        res.status(400).send(err)
    }
})

postRouter.get("/top",async(req,res)=>{
    const {page}=req.query
    const {userID}=req.body
    const newPage=(page-1)*3
    try{
        let post=await PostModel.find({userID:userID}).skip(newPage).sort({no_of_comments:-1}).limit(3)
        res.status(200).send({msg:post})

    }catch(err){
        res.status(400).send(err)
    }
})

postRouter.patch("/update/:id",async(req,res)=>{
    const {userID}=req.body;
    const {id}=req.params;
    const payload=req.body;

    let post=await PostModel.findOne({_id:id})
    try{
        if(userID==post.userID){
            await PostModel.findByIdAndUpdate({_id:id},payload)
            res.status(200).send({msg:"post updated!"})
        }else{
            res.status(400).send({msg:"please login first"})
        }
    }catch(err){
        res.status(400).send(err)
    }

})

postRouter.delete("/delete/:id",async(req,res)=>{
    const {userID}=req.body;
    const {id}=req.params;
    

    let post=await PostModel.findOne({_id:id})
    try{
        if(userID==post.userID){
            await PostModel.findByIdAndDelete({_id:id})
            res.status(200).send({msg:"post deleted!"})
        }else{
            res.status(400).send({msg:"please login first"})
        }
    }catch(err){
        res.status(400).send(err)
    }
})

module.exports={postRouter}