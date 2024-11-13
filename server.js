const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const path = require("path");
const { open } = require("sqlite");

const server_instance = express();
const dbPath = path.join(__dirname, "book_review.db");
let dataBase = null;

server_instance.use(cors());
server_instance.use(express.json());

const initialize_DataBase_and_Server = async () => {
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    server_instance.listen(3005, () => {
      console.log("Server is running on http://localhost:3005");
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initialize_DataBase_and_Server();

// Create Book Reviews
server_instance.post("/create_book_review/", async (request, response) => {
  const {
    id,
    bookTitle,
    bookAuthor,
    bookReview,
    reviewerName,
    rating,
  } = request.body;
  try {
    if (
      !id ||
      !bookTitle ||
      !bookAuthor ||
      !bookReview ||
      !reviewerName ||
      !rating
    ) {
      response.status(400).send("All fields are required to fill.");
    } else {
      const createBookQuery = `INSERT INTO book (id, book_title, book_author, book_review, reviewer_name, rating) VALUES (?, ?, ?, ?, ?, ?);`;
      await dataBase.run(createBookQuery, [
        id,
        bookTitle,
        bookAuthor,
        bookReview,
        reviewerName,
        rating.toString(),
      ]);
      response
        .status(200)
        .send(`Book created successfully: Title = ${bookTitle}.`);
    }
  } catch (error) {
    response.status(500).send(`Book already created: Title = ${bookTitle}.`);
    console.log(`Error while creating book: ${error}`);
  }
});

// Read All Books Data
server_instance.get("/read_books_review/", async (request, response) => {
  const { sort, pageNo, search } = request.query;
  const limit = 5;
  const offset = (parseInt(pageNo) - 1) * limit;
  const searchParams = [search, search, search, search, search];
  const queryParams = [...searchParams, limit, offset];
  let getBookQuery;
  const countQuery = `SELECT COUNT(*) as totalCount FROM book WHERE book_title LIKE '%' || ? || '%' OR 
        book_author LIKE '%' || ? || '%' OR book_review LIKE '%' || ? || '%' OR 
        reviewer_name LIKE '%' || ? || '%' OR rating LIKE '%' || ? || '%';`;

  if (sort === "NORMAL") {
    getBookQuery = `SELECT * FROM book WHERE book_title LIKE '%' || ? || '%' OR 
        book_author LIKE '%' || ? || '%' OR book_review LIKE '%' || ? || '%' OR 
        reviewer_name LIKE '%' || ? || '%' OR rating LIKE '%' || ? || '%' LIMIT ? OFFSET ?;`;
  } else {
    getBookQuery = `SELECT * FROM book WHERE book_title LIKE '%' || ? || '%' OR 
        book_author LIKE '%' || ? || '%' OR book_review LIKE '%' || ? || '%' OR 
        reviewer_name LIKE '%' || ? || '%' OR rating LIKE '%' || ? || '%' 
        ORDER BY book_title  ${sort} LIMIT ? OFFSET ?;`;
  }
  try {
    const readBookData = await dataBase.all(getBookQuery, queryParams);
    const countQueryResult = await dataBase.all(countQuery, searchParams);
    response.status(200).send({
      totalBooksCount: countQueryResult[0].totalCount,
      books: readBookData,
    });
  } catch (error) {
    response.status(500).send("Error occurred while fetching data.");
    console.log(`Error occurred while fetching data:${error}`);
  }
});

// Update Books
server_instance.put("/edit_book/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const checkExistBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const checkExistBook = await dataBase.get(checkExistBookQuery, [id]);
    if (!checkExistBook) {
      response
        .status(400)
        .send(`book data is not found in database regarding the ${id}`);
    } else {
      const {
        bookTitle = checkExistBook.book_title,
        bookAuthor = checkExistBook.book_author,
        bookReview = checkExistBook.book_review,
        reviewerName = checkExistBook.reviewer_name,
        rating = checkExistBook.rating,
      } = request.body;
      const updateBookDataQuery = `UPDATE book SET book_title = ?, book_author = ?, book_review = ?, reviewer_name = ?, rating = ? WHERE id = ?;`;
      await dataBase.run(updateBookDataQuery, [
        bookTitle,
        bookAuthor,
        bookReview,
        reviewerName,
        rating,
        checkExistBook.id,
      ]);
      response.status(200).send("Book data updated successfully");
    }
  } catch (error) {
    response.status(500).send("An error occurred while updating book");
    console.log(`An error occurred while updating book: ${error}`);
  }
});

// Delete Book
server_instance.delete("/delete_book/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const checkBookDataQuery = `SELECT * FROM book WHERE id = ?;`;
    const checkBookData = await dataBase.get(checkBookDataQuery, [id]);
    if (!checkBookData) {
      response
        .status(400)
        .send(
          `book data is not found for delete in database regarding the ${id}`
        );
    } else {
      const deleteBookDataQuery = `DELETE FROM book WHERE id = ?;`;
      await dataBase.run(deleteBookDataQuery, [checkBookData.id]);
      response.status(200).send("Book data deleted successfully");
    }
  } catch (error) {
    response.status(500).send("Internal Server Error");
    console.log(`Error while deleting book: ${error}`);
  }
});
