import mongoose from "mongoose"
export const  connectDB = async () => {
    try {
        console.log('connecting to mongo :', process.env.MONGO_URL)
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to MongoDB at: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`)
        process.exit(1) // 1 is failure 0 status code is success
    }

}
