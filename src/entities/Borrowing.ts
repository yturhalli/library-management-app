import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity({name: "borrowing"})
export class Borrowing {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.borrowings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Book, book => book.borrowings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "book_id" })
  book!: Book;

  @Column({  name: "borrowed_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  borrowedAt!: Date;

  @Column({ name: "returned_at",  type: "timestamp", nullable: true })
  returnedAt?: Date | null;

  
  @Column({ type: "decimal", precision: 2, scale: 1, nullable: true })
  rating?: number;
}