import { Request, Response } from "express";
import { AppDataSource } from "../db/typeorm.config";
import { User } from "../entities/User";
import { Book } from "../entities/Book";
import { Borrowing } from "../entities/Borrowing";
import { UserDetail } from "../helpers/User/userDetail";
import { sendResponse } from "../helpers/Response/sendResponse";

const userRepository = AppDataSource.getRepository(User);
const bookRepository = AppDataSource.getRepository(Book);
const borrowingRepository = AppDataSource.getRepository(Borrowing);

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find();
    sendResponse(res, "success", "Users are successfully fetched", users, null);
  } catch (error) {
    console.error("Error fetching users:", error);
    sendResponse(
      res,
      "error",
      "Failed to fetch users",
      null,
      [error.message],
      500
    );
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    const user = userRepository.create({ name });

    await userRepository.save(user);
    sendResponse(
      res,
      "success",
      "Users is successfully created",
      user,
      null,
      201
    );
  } catch (error) {
    console.error("Error creating user:", error);
    sendResponse(
      res,
      "error",
      "Failed to create user",
      null,
      [error.message],
      500
    );
  }
};

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const userId = Number(user_id);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      sendResponse(
        res,
        "error",
        "Failed to fetch user",
        null,
        ["User not found"],
        404
      );
      return;
    }

    const borrowedBooks = await borrowingRepository.find({
      where: {
        user: { id: userId },
      },
    });

    let responseUser = UserDetail.build(user.name);

    if (!borrowedBooks || borrowedBooks.length === 0) {
      sendResponse(
        res,
        "success",
        "User is successfully fetched",
        responseUser,
        null,
        200
      );
      return;
    }

    responseUser.currentlyBorrowed = borrowedBooks
      .filter((book) => !book.returnedAt)
      .map((book) => {
        let borrowed: UserDetail.BorrowedBook = {
          id: book.id,
          borrowedAt: String(book.borrowedAt),
          returnedAt: null,
          rating: null,
        };
        return borrowed;
      });

    responseUser.returnedBooks = borrowedBooks
      .filter((book) => book.returnedAt)
      .map((book) => {
        let borrowed: UserDetail.BorrowedBook = {
          id: book.id,
          borrowedAt: String(book.borrowedAt),
          returnedAt: String(book.returnedAt),
          rating: book.rating,
        };
        return borrowed;
      });
    sendResponse(
      res,
      "success",
      "User is successfully fetched",
      responseUser,
      null,
      200
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    sendResponse(
      res,
      "error",
      "Failed to fetch user",
      null,
      [error.message],
      500
    );
  }
};

const borrowBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, book_id } = req.params;
    const userId = Number(user_id);
    const bookId = Number(book_id);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      sendResponse(
        res,
        "error",
        "Failed to fetch user",
        null,
        ["User not found"],
        404
      );
      return;
    }
    const book = await bookRepository.findOneBy({ id: bookId });

    if (!book) {
      sendResponse(
        res,
        "error",
        "Failed to fetch book",
        null,
        ["Book not found"],
        404
      );
      return;
    }

    const existingBorrowing = await borrowingRepository
      .createQueryBuilder("borrowing")
      .where("borrowing.book_id = :bookId", { bookId })
      .andWhere("borrowing.returned_at IS NULL")
      .getOne();

    if (existingBorrowing) {
      sendResponse(
        res,
        "error",
        "Failed to create transaction",
        null,
        ["Book has already been borrowed"],
        400
      );
      return;
    }

    const borrowTransaction = borrowingRepository.create({
      user,
      book,
      returnedAt: null,
      rating: null,
    });

    await borrowingRepository.save(borrowTransaction);

    sendResponse(
      res,
      "success",
      "Transaction is successfully created. Book is given.",
      borrowTransaction,
      null,
      201
    );
  } catch (error) {
    console.error("Error create borrowing transaction:", error);
    sendResponse(
      res,
      "error",
      "Failed to create borrowing transaction",
      null,
      [error.message],
      500
    );
  }
};

const returnBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { score } = req.body;
    const { user_id, book_id } = req.params;
    const userId = Number(user_id);
    const bookId = Number(book_id);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      sendResponse(
        res,
        "error",
        "Failed to fetch user",
        null,
        ["User not found"],
        404
      );
      return;
    }
    const book = await bookRepository.findOneBy({ id: bookId });

    if (!book) {
      sendResponse(
        res,
        "error",
        "Failed to fetch book",
        null,
        ["Book not found"],
        404
      );
      return;
    }

    const existingBorrowings = await borrowingRepository.find({
      where: {
        user: { id: userId },
        book: { id: bookId },
      },
    });

    if (!existingBorrowings.some((existing) => existing.returnedAt === null)) {
      sendResponse(
        res,
        "error",
        "Failed to finish transaction",
        null,
        ["There is no borrowing to terminate"],
        404
      );
      return;
    }

    const currentBorrowing = existingBorrowings.filter(
      (existing) => existing.returnedAt === null
    )[0];

    currentBorrowing.returnedAt = new Date();
    currentBorrowing.rating = score;
    await borrowingRepository.save(currentBorrowing);
    sendResponse(
      res,
      "success",
      "Book is successfully returned",
      currentBorrowing,
      null,
      200
    );
  } catch (error) {
    console.error("Error terminate borrowing transaction:", error);
    sendResponse(
      res,
      "error",
      "Failed to terminate borrowing transaction",
      null,
      [error.message],
      500
    );
  }
};

const userController = {
  getUsers,
  createUser,
  getUser,
  borrowBook,
  returnBook,
};

export default userController;
