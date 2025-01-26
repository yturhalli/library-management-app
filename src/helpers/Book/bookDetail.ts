import { Borrowing } from "../../entities/Borrowing";

export namespace BookDetail {
    export type Model = {
      name: string;
      averageRating: number
    };
  
    export function build(
      name: string
    ): BookDetail.Model {
      return {
        name,
        averageRating: 0
      };
    }

    export function calcAverageRating (completedTransactions: Borrowing[]) {
        let average = (
            completedTransactions.reduce(
              (acc, borrowed) => acc + Number(borrowed.rating),
              0
            ) / completedTransactions.length
          ).toFixed(1);

          return Number(average)
    }
  }