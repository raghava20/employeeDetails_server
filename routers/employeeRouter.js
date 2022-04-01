import express from "express"
import { deleteEmployeeDetails, getAllEmployeeDetails, getDepartments, getEmployeeDetailsById, postDepartments, postEmployeeDetails, updateEmployeeDetails } from "../controllers/employeeControllers.js"

const router = express.Router()

router.get('/', getAllEmployeeDetails)

router.get('/:id', getEmployeeDetailsById)

router.post('/', postEmployeeDetails)

router.put('/:id', updateEmployeeDetails)

router.delete("/:id", deleteEmployeeDetails)

router.post("/departments", postDepartments)

router.get("/departments/details", getDepartments)

export const employeeRouter = router;