import app from "./src/app.js"
import dotenv from "dotenv"
dotenv.config()
let startServer=async()=>{
    
try {
     app.listen(3000,()=>{
         console.log("server started")
     })
} catch (error) {
    console.log(error)
    
}
}
startServer()