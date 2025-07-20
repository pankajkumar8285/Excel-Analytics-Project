import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const dbInstances = await mongoose.connect(process.env.DB_URI)
        console.log(`\nMongodb connected || db host ${dbInstances.connection.host}`)
        }
        
     catch (error) {
        console.log(`Error in the db connection ${error}`) 
     }
}


export {connectDB}