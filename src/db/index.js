import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";  

const connectDb = async ()=> {
try {
     const connectionDatabase = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`Connection with Mongoose is estabished: ${connectionDatabase.connection.host} `)
        }catch (error) {
         console.log(`Error is found at error`)   
    }
}
export default connectDb;