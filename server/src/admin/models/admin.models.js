import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const adminSchema = new mongoose.Schema( {
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
        
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: ''
    },
    adminRefreshToken: {
        type: String,
        default: ''
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    }
},{timestamps: true})


adminSchema.pre("save", async function(next)  {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10) 
    next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
    
    return bcrypt.compare(password, this.password)
}

  
adminSchema.methods.generateAccessToken = async function() {
    return jwt.sign({
        _id: this._id,
        email: this.email
    },
process.env.ADMIN_ACCESS_TOKEN_SECRET,
{
    expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY
})
    
}
adminSchema.methods.generateRefreshToken = async function() {
    return jwt.sign({
        
       _id: this._id
    },
process.env.ADMIN_REFRESH_TOKEN_SECRET,
{
    expiresIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRY
})
    
}


export const Admin = mongoose.model('Admin', adminSchema)