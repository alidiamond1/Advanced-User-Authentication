# Advanced User Authentication System

A robust and secure user authentication system built with React, Node.js, and MongoDB, featuring advanced security measures and a modern UI.

## Features

- User registration with email verification
- Secure login with JWT authentication
- Password strength meter
- Forgot password functionality
- Reset password capability
- Email notifications using Mailtrap
- Responsive and animated UI using Tailwind CSS and Framer Motion
- State management with Zustand

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Email Service**: Mailtrap
- **Other Libraries**: Axios, React Router, React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- Mailtrap account for email testing

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/alidiamond1/Advanced-User-Authentication.git
   cd Advanced-User-Authentication
   ```

2. Install dependencies for both frontend and backend:
   ```
   npm install
   cd frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   MAILTRAP_ENDPOINT=your_mailtrap_endpoint
   MAILTRAP_TOKEN=your_mailtrap_token
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

5. In a new terminal, start the frontend:
   ```
   cd frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `backend/`: Contains the Node.js server code
  - `controllers/`: Request handlers
  - `models/`: MongoDB schemas
  - `routes/`: API routes
  - `middleware/`: Custom middleware functions
  - `utils/`: Utility functions
  - `mailtrap/`: Email templates and configuration
- `frontend/`: React application
  - `src/`
    - `components/`: Reusable React components
    - `pages/`: Main page components
    - `store/`: Zustand store for state management
    - `utils/`: Utility functions

## API Endpoints

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Authenticate a user
- `POST /api/auth/loginout`: Log out a user
- `POST /api/auth/verify-email`: Verify user's email
- `POST /api/auth/forgot-password`: Initiate password reset
- `POST /api/auth/reset-password/:token`: Reset user's password
- `GET /api/auth/check-auth`: Check user's authentication status

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Mailtrap](https://mailtrap.io/)
