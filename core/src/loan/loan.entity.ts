import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/books.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.loans, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Book, (book) => book.loans, { onDelete: 'CASCADE' })
  book: Book;

  @CreateDateColumn()
  borrowedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ default: false })
  isReturned: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
