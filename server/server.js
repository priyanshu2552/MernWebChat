const express=require('express');
const app=express();

app.get('/',(req,res)=>{
    res.send('hello home page');
})
app.listen(5000,()=>{
    console.log('listening on port 5000');
})