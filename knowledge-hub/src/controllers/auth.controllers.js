import userModel from "../models/user.Schema.js";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import jwt  from "jsonwebtoken"
import bcrypt from "bcrypt"

export const registerController = async (req,res) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.message });
    }

    let { name, email, password } = result.data;
    let isexist = await userModel.findOne({
      email,
    });
    if (isexist) {
      return res.status(409).json({
        message: "user already exist",
      });
    }

    const user = await  userModel.create({
      name,
      email,
      password,
    });

    res.status(200).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginController= async (req,res)=>{
try {
  
 const data = loginSchema.safeParse(req.body)
 if(!data.success){
  return res.status(400).json({ message: data.error.message });
 }
 let {email,password} = data.data;
 let user = await userModel.findOne({email}).select("+password");
 if(!user){
  return res.status(404).json({message:"user not found"})
 }
 const ismatch= await bcrypt.compare(password,user.password)

if(!ismatch){
  return res.status(401).json({message:"invalid credentials"})
}
const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})



 return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });




} catch (error) {
  return res.status(500).json({
    message:error.message
  })
}
}