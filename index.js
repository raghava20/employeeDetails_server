import express from 'express';
import cors from "cors"
import dotenv from "dotenv"
import { mongo } from './connection.js';
import { authenticationRouter } from './routers/authenticationRouter.js';
import { employeeRouter } from './routers/employeeRouter.js';

dotenv.config()

let app = express()
let PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

mongo()

app.get("/", (req, res) => {
    res.send("You are listening on the employee details portal!!!")
})

app.use("/", authenticationRouter)
app.use("/employee-details", employeeRouter)

app.listen(PORT, () => console.log('listening on port', PORT))