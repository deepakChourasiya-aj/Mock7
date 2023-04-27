const jwt = require("jsonwebtoken")
const express  =require("express")
require("dotenv").config();

const auhtenticator = (req,res,next)=>{
    let token =req.headers.authorization;
    console.log(token,'headers')
    try {
        if(token){
            let decoded = jwt.verify(token,process.env.token);
            if(decoded){
                let userID = decoded.userID;
                req.body.userID = userID;
                next();
            }else{
               return res.send({msg:"not authorized login first"});
            }
        }
    } catch (error) {
       return res.send({msg:"not authorized login"})
        console.log('error in authentication',error);
    }
}

module.exports = {
    auhtenticator
}