const express=require('express')
const authController=require('../controllers/userController')

const authRouter=express.Router()


authRouter.post('/register',authController.getRegister);
authRouter.post('/login',authController.getLogin)

module.exports=authRouter