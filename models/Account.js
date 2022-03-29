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
        unique: true,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    accountVerifyToken: String,
    date: {
        type: Date,
        default: Date.now()
    }

})


export const Account = mongoose.model('Account', accountSchema, 'accounts')