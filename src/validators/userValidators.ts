import { body, param } from "express-validator";

export const validateGetUser = [
  param("user_id")
    .isInt({ gt: 0 })
    .withMessage("User id must be a valid positive integer"),
];

export const validateCreateUser = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
];

export const validateBorrowBook = [
  param("user_id")
    .isInt({ gt: 0 })
    .withMessage("User id must be a valid positive integer"),
  param("book_id")
    .isInt({ gt: 0 })
    .withMessage("Book id must be a valid positive integer"),
];

export const validateReturnBook = [
  param("user_id")
    .isInt({ gt: 0 })
    .withMessage("User id must be a valid positive integer"),
  param("book_id")
    .isInt({ gt: 0 })
    .withMessage("Book id must be a valid positive integer"),
  body("score")
    .notEmpty()
    .withMessage("Score is required")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Score must be a number between 0 and 10"),
];

const userValidators = {
    validateGetUser,
    validateCreateUser,
    validateBorrowBook,
    validateReturnBook
  };
  
  export default userValidators;