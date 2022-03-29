import express from 'express';
import cors from "cors"
import dotenv from "dotenv"
import { mongo } from './connection.js';

dotenv.config()

let app = express()
let PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

mongo()

app.listen(PORT, () => console.log('listening on port', PORT))