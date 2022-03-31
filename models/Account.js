import mongoose from "mongoose"

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountVerifyToken: String,
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: "employee",
        enum: ["employee", "admin"]
    },
    resetLink: {
        type: String,
        default: ""
    }

})


export const Account = mongoose.model('Account', accountSchema, 'accounts')