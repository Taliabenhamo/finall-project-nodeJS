const mongoose=require('mongoose');
const JOI=require('joi')
const jwt=require('jsonwebtoken')
const config=require('config')
const bcrypt=require('bcryptjs')

const UserSchema=new mongoose.Schema({


    username:{
        type:String,
        required:true,
        minlenght:2,
        maxlenght:30
        
    },
    email:{
        type:String,
        required:true,
        minlenght:6,
     
    },
    password:{

        type:String,
        required:true,
        minlenght:8,
        maxlenght:50,
        // select:false
    },
    biz:{
        type:Boolean,
        default:false
    },
    createdAt: { type: Date, default: Date.now }

});

// the hashing proccess password
 UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); 
  this.password = await bcrypt.hash(this.password, 12); 

  next();
});

const UserModel = mongoose.model("UserModel", UserSchema, "users");



module.exports=UserModel;
