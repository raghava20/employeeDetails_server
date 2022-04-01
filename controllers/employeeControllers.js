import { Departments } from "../models/Departments.js"
import { EmployeeDetails } from "../models/EmployeeDetails.js"

// get all employees details
export const getAllEmployeeDetails = async (req, res) => {
    try {
        const response = await EmployeeDetails.find()
        res.status(200).json({ response })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// get employee details by id
export const getEmployeeDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await EmployeeDetails.findOne({ _id: id })
        res.status(200).json({ response })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// create new employee details
export const postEmployeeDetails = async (req, res) => {
    try {
        const { firstName, lastName, gender, address, email, dateOfBirth, contactNumber, department, jobTitle, maritalStatus, bankDetails } = req.body;
        const account = new EmployeeDetails({
            account: req.user,
            firstName,
            lastName,
            gender,
            address,
            email,
            dateOfBirth,
            contactNumber,
            department,
            jobTitle,
            maritalStatus,
            bankDetails
        })

        await account.save()
        res.status(200).json({ message: "Posted Successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }

}

// update the employee details using id
export const updateEmployeeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        let accountDetails = {}
        const { firstName, lastName, gender, address, email, dateOfBirth, contactNumber, department, jobTitle, maritalStatus, bankDetails } = req.body;

        accountDetails = {
            firstName,
            lastName,
            gender,
            address,
            email,
            dateOfBirth,
            contactNumber,
            department,
            jobTitle,
            maritalStatus,
            bankDetails
        }
        await EmployeeDetails.findOneAndUpdate({ _id: id }, { $set: accountDetails })

        res.status(200).json({ message: "Updated details successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// delete the employee details using id
export const deleteEmployeeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        await EmployeeDetails.findOneAndDelete({ _id: id })
        res.status(200).json({ message: "Deleted details successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// get all the departments created by the employee
export const getDepartments = async (req, res) => {
    console.log("trigger")
    try {
        console.log("object");
        const response = await Departments.find()
        console.log(response)
        res.status(200).json({ response })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// create the departments
export const postDepartments = async (req, res) => {
    try {
        const department = req.body;
        const response = await Departments.find()
        if (response.filter(depart => depart.department === department.department).length > 0) return res.status(403).json({ message: "Already added the department" })

        const result = new Departments(department)
        await result.save()
        res.status(200).json({ message: "Added department" })
    }
    catch (err) {
        res.status(500).json({ message: err })

    }
}