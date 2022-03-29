import { EmployeeDetails } from "../models/EmployeeDetails.js"


export const getAllEmployeeDetails = async (req, res) => {
    try {
        const response = await EmployeeDetails.find()
        res.status(200).json({ response })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

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
        await EmployeeDetails.findOneAndUpdate({ account: id }, { $set: { accountDetails } }, { new: true })
        res.status(200).json({ message: "Updated details successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

export const deleteEmployeeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        await EmployeeDetails.findOneAndDelete({ account: id })
        res.status(200).json({ message: "Deleted details successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}