import mongoose from "mongoose"

const Schema = mongoose.Schema;

const employeeDetailsSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    maritalStatus: {
        type: String,
        required: true,
        enum: ["married", "unMarried"],
    },
    jobTitle: {
        type: String
    },
    bankDetails: {
        type: String,
        trim: true
    }
})

export const EmployeeDetails = mongoose.model("EmployeeDetails", employeeDetailsSchema, "employeeDetails")