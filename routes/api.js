import express from "express";
const router = express.Router();
import * as UsersController from "../app/controllers/UsersController.js";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";

// Users
router.post("/Registration",UsersController.Registration)
router.post("/Login",UsersController.Login)
router.get("/ProfileDetails",AuthMiddleware,UsersController.ProfileDetails)
router.post("/ProfileUpdate",AuthMiddleware,UsersController.ProfileUpdate)
router.post("/DeleteUserById/:id",AuthMiddleware,UsersController.DeleteUserById)
router.get("/GetAllUsers",AuthMiddleware,UsersController.GetAllUsers)

export default router;