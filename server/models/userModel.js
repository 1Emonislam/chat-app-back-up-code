const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    online: {
        type: String,
    },
    lastOneline: {
        type: Date,
    },
    firstName: {
        type: String,
        required: [true, 'First Name is Required']
    },
    lastName: {
        type: String
    },
    username: {
        type: String,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'invalid email'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Must be at least 8 characters'],
        min: 8,
    },
    phone: {
        type: String,
        trim: true,
        default: 'N/A'
    },
    gender: {
        type: String,
        lowercase: true,
        default: 'N/A'
    },
    birthDate: {
        type: Date,
        required: [true, 'Birth Date is requied!'],
    },
    pic: {
        type: String,
        default: "https://i.ibb.co/BGbPkX9/dummy-avatar-300x300-1.jpg",
    },
    info: {
        type: String,
        trim: true
    },
    status: {
        type: String,
    },
    socialMedia: [
        {
            facebook: {
                type: String,
                default: 'N/A'
            },
            twitter: {
                type: String,
                default: 'N/A'
            },
            linkedin: {
                type: String,
                default: 'N/A'
            },
            github: {
                type: String,
                default: 'N/A'
            },
            youtube: {
                type: String,
                default: 'N/A'
            },
            instagram: {
                type: String,
                default: 'N/A'
            },
            stackoverflow: {
                type: String,
                default: 'N/A'
            }
        }
    ]
}, {
    timestamps: true,
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
const User = mongoose.model("User", userSchema)
module.exports = User;