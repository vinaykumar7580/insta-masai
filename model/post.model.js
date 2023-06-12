const mongoose=require("mongoose")

const postSchema=mongoose.Schema({
    title:{
        type:String
    },
    body:{
        type:String
    },
    device:{
        type:String,
        enum:["Laptop", "Tablet", "Mobile"],
        default:"Laptop"

    },
    no_of_comments:{
        type:Number
    },
    userID:{
        type:String
    }

},{
    versionKey:false
})

const PostModel=mongoose.model("post",postSchema)

module.exports={PostModel}

