const express=require("express")
const cors=require("cors")
const { connection } = require("./db")
const { userRouter } = require("./routes/user.routes")
const { blacklist } = require("./blacklist")
const { auth } = require("./middleware/auth")
const { postRouter } = require("./routes/post.routes")

const app=express()

app.use(express.json())
app.use(cors())

app.use("/users",userRouter)

app.use(auth)
app.use("/posts",postRouter)

app.get("/logout",async(req,res)=>{
    const token=req.headers.authorization
    try{
        if(token){
            blacklist.push(token)
        }else{
            res.status(400).send({msg:"please login first"})
        }

    }catch(err){
        res.status(400).send(err)
    }
})

app.listen(8080,async()=>{
    try{
        await connection
        console.log("db connected")

    }catch(err){
        console.log(err)
        console.log("db not connected")
    }
    console.log("server is running on port 8080")
})
