import { app } from "./app.js";
import { connectDB } from "./db/db.js";
import dotenv from 'dotenv'

dotenv.config({ path: './env' });

const PORT = process.env.PORT;

connectDB().then(() => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on the Port ${PORT}`);
        })
        app.on("error" ,(error) => {
            console.log("Error", error)
            throw error;
        })
    } catch (error) {
    
        console.log(`Mongodb connection failed !!! ${error}`)
    }
})
