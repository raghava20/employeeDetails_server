import mongoose from "mongoose"

const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    department: {
        type: String,
        required: true,
        ref: "Account"
    }
})

export const Departments = mongoose.model("Departments", departmentSchema, 'departments')