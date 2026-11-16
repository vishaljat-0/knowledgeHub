import { Router } from "express";
import { registerController } from "../controllers/auth.controllers.js";
const authRouter = Router();





authRouter.use("./register",registerController)






export default authRouter;
