const userModel=require('../model/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const { default: mongoose } = require('mongoose')



exports.getRegister=async(req,res)=>{
    const {name,email,password}=req.body

    if(!name || !email || !password){
        return res.json({success:false,message:"Fields are missing"})
    }

    try{
        let check=await userModel.findOne({email})
        if(check){
            return res.json({success:true,message:"User Already Exist"})
        }
        const hashPassword=await bcrypt.hash(password,10)
        const user=new userModel({name,email,password:hashPassword})
        await user.save()

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'30d'})
                res.cookie('token',token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV==="production",
                    sameSite:process.env.NODE_ENV==="production"?"none":"strict",
                    maxAge:7*24*60*60*1000
                })
        return res.json({success:true,message:"Responce saved Successfullt"})

    }
    catch(error){
            return res.json({success:false,message:error.message})
    }
    
    
}

exports.getLogin =async(req,res)=>{
    const {email,password}=req.body;
    if(!email){
        return res.json({success:false,message:"Email is Required"})
    }
    if(!password){
         return res.json({success:false,message:"Password is required"})
    }

    try{
        const user=await userModel.findOne({email});

        if(!user){
             return res.json({success:false,message:"User Doesnot Exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, message: "Login Successful" });

        // return res.json({success:true,message:"Login Successful"})


    }
    catch(error){
            return res.json({ success: true, message: error.message});
    }
}