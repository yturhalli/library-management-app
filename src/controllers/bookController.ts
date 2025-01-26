import { Request, Response } from "express";
import { AppDataSource } from "../db/typeorm.config";
import { Book } from "../entities/Book";
import { Borrowing } from "../entities/Borrowing";
import { BookDetail } from "../helpers/Book/bookDetail";
import { sendResponse } from "../helpers/Response/sendResponse";

const bookRepository = AppDataSource.getRepository(Book);
const borrowingRepository = AppDataSource.getRepository(Borrowing);

const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await bookRepository.find();
    sendResponse(res, "success", "Books are successfully fetched", books, null);
  } catch (error) {
    console.error("Error fetching books:", error);
    sendResponse(
      res,
      "error",
      "Failed to fetch books",
      null,
      [error.message],
      500
    );
  }
};

const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const book = bookRepository.create({ name });

    await bookRepository.save(book);

    sendResponse(
      res,
      "success",
      "Book is successfully created",
      book,
      null,
      201
    );
  } catch (error) {
    console.error("Error creating book:", error);
    sendResponse(
      res,
      "error",
      "Failed to create book",
      null,
      [error.message],
      500
    );
  }
};

const getBook = async (req: Request, res: Response) => {
  try {
    const { book_id } = req.params;
    const bookId = Number(book_id);

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

    const allBorrowings = await borrowingRepository
      .createQueryBuilder("borrowing")
      .where("borrowing.book_id = :bookId", { bookId })
      .getMany();

    const completedTransactions = allBorrowings.filter(
      (borrowing) => borrowing.rating
    );

    let responseBook = BookDetail.build(book.name);
    let average = BookDetail.calcAverageRating(completedTransactions);
    responseBook.averageRating = average ? average : 0;

    sendResponse(
      res,
      "success",
      "Book is successfully fetched",
      responseBook,
      null,
      200
    );
  } catch (error) {
    console.error("Error fetching book:", error);
    sendResponse(
      res,
      "error",
      "Failed to fetch book",
      null,
      [error.message],
      500
    );
  }
};

const bookController = {
  getBooks,
  createBook,
  getBook,
};

export default bookController;
