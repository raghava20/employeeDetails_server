import mongoose from "mongoose"

export const mongo = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to MongoDB!!!")
    }
    catch (err) {
        process.exit()
    }
}