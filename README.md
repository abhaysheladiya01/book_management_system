# book_management_system

A Node.js application for managing books, users, carts, and orders. This project has been refactored to use **MongoDB** as the database and includes additional features such as email notifications, invoice generation, payment integration, and more.

---

## Features

- **Product Management**: Add, edit, delete, and view books.
- **User Management**: Users can register, login, and manage their cart.
- **Cart & Orders**: Add products to cart, place orders, and view order history.
- **MongoDB Integration**: All models are connected via MongoDB using the `MongoClient`.
- **Email Notifications (SendGrid)**: Real-time email notifications for actions such as order placement and account registration.
- **Invoice Generation**: Generate PDF invoices for orders using Multer for file handling.
- **Stripe Payment Integration**: Secure payment gateway integration using Stripe for processing payments.
- **Pagination**: Products and orders are paginated for better scalability.
- **Validation**: Input validation for user registration, login, and product management using `express-validator`.
- **Authentication**: Session and cookie-based authentication for secure user login and authorization.

---

## Database

- Uses **MongoDB Atlas** or a local MongoDB instance.
- Refactored models (`Product` and `User`) to use MongoDB instead of Sequelize.
- Products and orders use `_id` as the primary key to align with MongoDB conventions.
- Cart is stored as an array of items in the user document.

---

## Setup

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **MongoDB**: You can use either MongoDB Atlas (cloud-based) or a local MongoDB instance.
- **SendGrid**: Sign up for SendGrid and get an API key to enable email functionality.
- **Stripe**: Create a Stripe account and get your API keys for payment processing.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abhaysheladiya01/book_management_system.git
   cd book_management_system
