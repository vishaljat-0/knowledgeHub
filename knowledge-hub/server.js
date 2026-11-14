import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";

dotenv.config();

const startServer = async () => {
  try {
    await connectDb();

    app.listen(3000, () => {
      console.log("Server started on port 3000");
    }); 

  } catch (error) {
    console.log("Startup error:", error.message);
    process.exit(1);
  }
};

startServer();