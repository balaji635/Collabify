const userModel=require('../model/userModel')
const problemModel=require('../model/problemModel')

exports.createStatement=async(req,res)=>{
    const {
        userID,hackathonName,teamName,
        membersRequired,registrationDeadline
        ,skillsRequired,description}=req.body

    if(!hackathonName || !teamName || !membersRequired || !registrationDeadline || !skillsRequired || !description){
        return res.json({success:false,message:"the above fileds are mossing"})

    }
    try {
        
        const problem=new problemModel({hackathonName,teamName,membersRequired,registrationDeadline,skillsRequired,description,createdBy:userID})
        await problem.save()
    
        return res.json({success:true,message:"Problem is stored successfully"})
    } catch (error) {
        return res.json({success:true,message:error.message})
        
    }





}