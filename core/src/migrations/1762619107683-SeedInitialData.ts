import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedInitialData1762619107683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash passwords for users
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const memberPassword = await bcrypt.hash('Member123!', 10);

    // Insert Users
    await queryRunner.query(
      `INSERT INTO "user" ("name", "email", "password", "role", "createdAt") VALUES
        ('Admin User', 'admin@library.com', '${adminPassword}', 'admin', NOW()),
        ('John Doe', 'member@library.com', '${memberPassword}', 'member', NOW())`,
    );

    // Insert Authors
    await queryRunner.query(
      `INSERT INTO "author" ("name", "bio", "birthDate") VALUES
        ('J.K. Rowling', 'British author best known for the Harry Potter series', '1965-07-31'),
        ('George Orwell', 'English novelist and essayist, journalist and critic', '1903-06-25'),
        ('Jane Austen', 'English novelist known primarily for her six major novels', '1775-12-16'),
        ('F. Scott Fitzgerald', 'American novelist and short story writer', '1896-09-24')`,
    );

    // Insert Books
    await queryRunner.query(
      `INSERT INTO "book" ("title", "summary", "isbn", "publishedAt") VALUES
        (
          'Harry Potter and the Philosopher''s Stone',
          'The first novel in the Harry Potter series follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday. He receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry, where he begins his education in magic and learns about his past.',
          '978-0747532699',
          '1997-06-26'
        ),
        (
          '1984',
          'A dystopian social science fiction novel and cautionary tale set in Airstrip One, a province of the superstate Oceania. The story follows Winston Smith, a member of the Outer Party who works for the Ministry of Truth, rewriting historical records to fit the propaganda needs of the government.',
          '978-0451524935',
          '1949-06-08'
        ),
        (
          'Pride and Prejudice',
          'A romantic novel that follows the character development of Elizabeth Bennet, the dynamic protagonist who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.',
          '978-0141439518',
          '1813-01-28'
        ),
        (
          'The Great Gatsby',
          'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway''s interactions with mysterious millionaire Jay Gatsby and Gatsby''s obsession to reunite with his former lover, Daisy Buchanan.',
          '978-0743273565',
          '1925-04-10'
        ),
        (
          'Animal Farm',
          'An allegorical novella reflecting events leading up to the Russian Revolution of 1917 and then on into the Stalinist era of the Soviet Union. The story is told through a group of farm animals who rebel against their human farmer, hoping to create a society where the animals can be equal, free, and happy.',
          '978-0451526342',
          '1945-08-17'
        )`,
    );

    // Insert Book-Author relationships
    // Assuming IDs will be auto-generated starting from 1
    await queryRunner.query(
      `INSERT INTO "book_authors_author" ("bookId", "authorId") VALUES
        (1, 1), -- Harry Potter by J.K. Rowling
        (2, 2), -- 1984 by George Orwell
        (3, 3), -- Pride and Prejudice by Jane Austen
        (4, 4), -- The Great Gatsby by F. Scott Fitzgerald
        (5, 2)  -- Animal Farm by George Orwell
      `,
    );

    // Insert Loans
    await queryRunner.query(
      `INSERT INTO "loan" ("userId", "bookId", "borrowedAt", "dueDate", "returnedAt", "isReturned") VALUES
        (2, 1, NOW() - INTERVAL '10 days', NOW() + INTERVAL '4 days', NULL, false),
        (2, 3, NOW() - INTERVAL '20 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days', true),
        (1, 2, NOW() - INTERVAL '5 days', NOW() + INTERVAL '9 days', NULL, false)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse order to maintain referential integrity
    await queryRunner.query(`DELETE FROM "loan" WHERE "userId" IN (1, 2)`);
    await queryRunner.query(
      `DELETE FROM "book_authors_author" WHERE "bookId" IN (1, 2, 3, 4, 5)`,
    );
    await queryRunner.query(
      `DELETE FROM "book" WHERE "isbn" IN ('978-0747532699', '978-0451524935', '978-0141439518', '978-0743273565', '978-0451526342')`,
    );
    await queryRunner.query(
      `DELETE FROM "author" WHERE "name" IN ('J.K. Rowling', 'George Orwell', 'Jane Austen', 'F. Scott Fitzgerald')`,
    );
    await queryRunner.query(
      `DELETE FROM "user" WHERE "email" IN ('admin@library.com', 'member@library.com')`,
    );
  }
}
