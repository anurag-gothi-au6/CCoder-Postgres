const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const Schema = mongoose.Schema;


const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        username:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        experience: {
            type: String,
            trim: true
        },
        education: {
            type: String,
            trim: true
        },
        accessToken: {
            type: String
        },
        contests: [
            {
                type: Schema.Types.ObjectId,
                ref: "contest"
            }
        ],
        moderator: [
            {
                type: Schema.Types.ObjectId,
                ref: "contest"
            }
        ],
        discussions: [
            {
                type: Schema.Types.ObjectId,
                ref: "discussion"
            }
        ],
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: "challenge",
            }
        ],
        submissions: [
            {
                type: Schema.Types.ObjectId,
                ref: "submission"
            }
        ],
        challenge:[
            {
                type: Schema.Types.ObjectId,
                ref: "challenge"
            }
        ]
    },
    { timestamps: true}
);

userSchema.statics.findByEmailAndPassword = async (email, password) => {
    try {
        const user = await User.findOne({ email: email});
        if(!user) throw new Error("Invalid Credentials");
        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched) throw new Error("Invalid Credentials");
        return user;
    } catch (err) {
        err.name = 'AuthError';
        throw err;
    }
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    
    const accessToken = await sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h"
    });
    user.accessToken = accessToken;
    await user.save();
    return accessToken;
}

userSchema.statics.nullifyToken = async (token) => {
    try {
        const user = await User.findOne({accessToken: token})
        user.accessToken = null;
        user.save();
        return user
        
    } catch (err) {
        console.log(err.message)   
    }
}

userSchema.statics.findByPassword = async (accessToken, oldpassword) => {
    try {
        const user = await User.findOne({accessToken:accessToken});
        if(!user) throw new Error("Invalid Credentials");
        const isMatched = await bcrypt.compare(oldpassword, user.password);
        if(!isMatched) throw new Error("Invalid Credentials");
        return user;
    } catch (err) {
        err.name = 'AuthError';
        throw err;
    }
};

userSchema.pre("save", async function(next) {
    const user = this;
    try {
        if(user.isModified("password")) {
            const hashedpassword = await bcrypt.hash(user.password, 10);
            user.password = hashedpassword;
            next()
        }
    } catch (err) {
        console.log(err.message)
        next(err)        
    }

});

const User = mongoose.model("user", userSchema);

module.exports = User;