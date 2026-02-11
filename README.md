# book_management_system

A Node.js application for managing books, users, carts, and orders. This project has been refactored to use **MongoDB** as the database.

---

## Features

- **Product Management**: Add, edit, delete, and view books.
- **User Management**: Users can register, login, and manage their cart.
- **Cart & Orders**: Add products to cart, place orders, and view order history.
- **MongoDB Integration**: All models are connected via MongoDB using the `MongoClient`.

---

## Database

- Uses **MongoDB Atlas** or a local MongoDB instance.
- Refactored models (`Product` and `User`) to use MongoDB instead of Sequelize.
- Products and orders use `_id` as the primary key to align with MongoDB conventions.
- Cart is stored as an array of items in the user document.
