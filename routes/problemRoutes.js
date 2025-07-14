const express=require('express')
const problemController=require('../controllers/problemController')
const {userCookies}=require('../middleware/userCookies')

const problemRouter=express.Router()

problemRouter.post('/create-problem',userCookies,problemController.createStatement)

module.exports=problemRouter