
import express from "express";
import  bookController  from "../controllers/bookController";
import bookValidators from "../validators/bookValidators";
import { validate } from "../middlewares/validate";

const router = express.Router();

// Get all books
router.get("/", bookController.getBooks);

// Get one book
router.get("/:book_id", bookValidators.validateGetBook, validate, bookController.getBook);

// Create
router.post("/", bookValidators.validateCreateBook, validate, bookController.createBook);

export default router;
