import express from "express";
import userController from "../controllers/userController";
import userValidators from "../validators/userValidators";
import { validate } from "../middlewares/validate";
const router = express.Router();

//Get all users
router.get("/", userController.getUsers);

//Get one user
router.get("/:user_id", userValidators.validateGetUser, validate, userController.getUser);

//Create user
router.post("/", userValidators.validateCreateUser, validate, userController.createUser);

//Borrow book
router.post("/:user_id/borrow/:book_id", userValidators.validateBorrowBook, validate, userController.borrowBook)

//Return book
router.post("/:user_id/return/:book_id", userValidators.validateReturnBook, validate, userController.returnBook)


export default router;
