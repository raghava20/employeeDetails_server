import express from "express"
import { deleteEmployeeDetails, getAllEmployeeDetails, postEmployeeDetails, updateEmployeeDetails } from "../controllers/employeeControllers.js"

const router = express.Router()

router.get('/', getAllEmployeeDetails)

router.post('/', postEmployeeDetails)

router.put('/:id', updateEmployeeDetails)

router.delete("/:id", deleteEmployeeDetails)

export const employeeRouter = router;