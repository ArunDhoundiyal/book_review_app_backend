Project Structure
plaintext
Copy code
.
├── server.js                 # Main entry point of the application
├── book_review.db (Table name: book          # SQLite database file (generated on the server)
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
server.js
The main Express server configuration, with middleware for JSON parsing and CORS, and routes for handling book review operations.

Getting Started
Prerequisites
Ensure you have Node.js and npm (or yarn) installed. You will also need SQLite3 for the database.

Installation
Clone the repository:

bash
Copy code
origin  https://github.com/ArunDhoundiyal/book_review_app_backend.git (fetch)
origin  https://github.com/ArunDhoundiyal/book_review_app_backend.git (push)
cd book_review_app_backend
Install dependencies:

bash
Copy code
npm install
Run the server locally:

bash
Copy code
npm start
The server will run on http://localhost:3005 by default.

API Endpoints
Render URL: https://book-review-app-backend-1.onrender.com

1. Create Book Review
Endpoint: POST /create_book_review/
https://book-review-app-backend-1.onrender.com/create_book_review/
Description: Creates a new book review.
Request Body: (JSON)
json
Copy code
{
    "id": "string (UUID)",
    "bookTitle": "string",
    "bookAuthor": "string",
    "bookReview": "string",
    "reviewerName": "string",
    "rating": "string (integer-like)"
}
Response: Success or error message.
3. Read All Book Reviews
Endpoint: GET /read_books_review/?sort=&pageNo=&search=
Description: Retrieves paginated book reviews with optional sorting and search.
Without Sorting: https://book-review-app-backend-1.onrender.com/read_books_review/?pageNo=1&search=Anna
With Sorting: https://book-review-app-backend-1.onrender.com/read_books_review/?sort=ASC&pageNo=1&search=Anna
Query Parameters:
sort: Sorting order for book titles (ASC, DESC, NORMAL).
pageNo: Page number for pagination.
search: Search term for book titles, authors, or reviews.
Response:
json
Copy code
{
  "totalBooksCount": "integer",
  "books": [
      {
          "id": "string",
          "bookTitle": "string",
          "bookAuthor": "string",
          "bookReview": "string",
          "reviewerName": "string",
          "rating": "string"
      }
  ]
}
5. Update Book Review
Endpoint: PUT /edit_book/:id
PUT /edit_book/123e4567-e89b-12d3-a456-426614174000
https://book-review-app-backend-1.onrender.com/edit_book/70819203-1234-56jj-7890-123456q12345
Content-Type: application/json
Description: Updates specific fields in a book review by ID.
Request Body: (JSON) Optional fields
json
Copy code
{
    "bookTitle": "string",
    "bookAuthor": "string",
    "bookReview": "string",
    "reviewerName": "string",
    "rating": "string"
}
Response: Success or error message.
7. Delete Book Review
Endpoint: DELETE /delete_book/:id
https://book-review-app-backend-1.onrender.com/delete_book/70819203-1234-56jj-7890-123456q12345
DELETE /delete_book/123e4567-e89b-12d3-a456-426614174000
Description: Deletes a book review by ID.
Response: Success or error message.



