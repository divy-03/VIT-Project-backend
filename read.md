# VIT-Project-backend

Welcome to the backend repository for the C2C (Consumer-to-Consumer) E-commerce website. This project is built using various technologies to create a robust and secure platform for users to buy and sell items.

## Technologies Used

- **Node.js:** A runtime environment for executing JavaScript on the server.
- **Express.js:** A fast and minimal web application framework for Node.js.
- **MongoDB:** A NoSQL database for storing and managing data.
- **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **Bcrypt.js:** For hashing and securely storing user passwords.
- **Cloudinary:** A cloud-based image and video management service.
- **dotenv:** For loading environment variables from a `.env` file.
- **express-fileupload:** Middleware for handling file uploads.
- **express-validator:** A set of express.js middlewares to validate request data.
- **jsonwebtoken:** For generating and verifying JSON Web Tokens (JWT) for authentication.
- **Nodemailer:** A module for sending email from Node.js applications.
- **validator:** A library for validating and sanitizing strings.
- **cookie-parser:** A middleware for parsing cookies in Express applications.

## Getting Started

To get started with the project, follow these steps:

1. Clone this repository:
   ```bash
   git clone https://github.com/divy-03/VIT-Project-backend.git

2. Change directory to the project folder:
   ```bash
   cd VIT-Project-backend

3. Install the project dependencies:
   ```bash
   npm install

4. Set up your environment variables by creating a `.env` file and adding necessary configurations such as database connection details, Cloudinary API key, and other secrets.

5. Start the server:
   ```bash
   npm start

This will start the Node.js server for your C2C E-commerce website backend.

## Project Structure

The project structure is organized to separate concerns and maintain a clean codebase. Here's a brief overview:

- **`app.js`**: The main application file where the Express app is configured and routes are defined.
- **`routes/`**: Contains route definitions for various parts of the application.
- **`controllers/`**: Handles the application's business logic.
- **`models/`**: Defines Mongoose schemas for data storage.
- **`middleware/`**: Contains custom middleware functions.
- **`utils/`**: Utility functions used throughout the application.
- **`config/`**: Configuration files for database connection and other settings.

