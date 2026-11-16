import mongoose from "mongoose";

import bcrypt from "bcrypt";
const userSchema =  new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
    },
    password:{
        type: String,
        required: true,
        select : false 
    }
} ,{
     timestamps: true
}
)

userSchema.pre('save',async function (){

 if (!this.isModified("password")) return;
  
const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})
const userModel = mongoose.model("User", userSchema);

export default userModel;