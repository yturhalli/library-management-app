import { body, param } from "express-validator";

const validateCreateBook = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
];

const validateGetBook = [
  param("book_id")
    .isInt({ gt: 0 })
    .withMessage("Book ID must be a positive integer"),
];

const bookValidators = {
  validateCreateBook,
  validateGetBook,
};

export default bookValidators;
