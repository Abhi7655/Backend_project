import dotenv from 'dotenv';
import connectDb from './db/index.js';
dotenv.config({
    path:'./env'
})
connectDb();


 
// ( async()=>{
// try {
//     await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
//     app.on("error",(error)=>{
//         console.log("ERR:",error)
//         throw err
//     })
//     app.listen(process.env.PORT,()=>{
//         console.log(`app is listening on ${process.env.PORT}`)
//     })
// } catch (error) {
//     console.log(error)
//     throw err
// }
// })()