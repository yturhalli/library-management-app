export namespace UserDetail {
  export type Model = {
    name: string;
    currentlyBorrowed: BorrowedBook[];
    returnedBooks: BorrowedBook[];
  };

  export function build(
    name: string
  ): UserDetail.Model {
    return {
      name,
      currentlyBorrowed: [],
      returnedBooks: []
    };
  }
  export type BorrowedBook = {
    id: number;
    borrowedAt: string;
    returnedAt: string | null;
    rating: number | null;
  };
}
