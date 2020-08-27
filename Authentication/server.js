const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const authr=require('./route/routes')
require('dotenv').config()

const app=express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
},(error)=>{
    if(error) throw error();
    console.log("connectd")
    
});
app.use('/api/user',authr)
const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})