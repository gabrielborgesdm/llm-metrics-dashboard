import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Author } from '../authors/authors.entity';
import { Loan } from '../loan/loan.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];

  @Column({ length: 500 })
  title: string;

  @Column('text')
  summary: string;

  @Column()
  isbn: string;

  @Column()
  publishedAt: Date;

  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable()
  authors: Author[];
}
