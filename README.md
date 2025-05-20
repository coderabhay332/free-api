# API Marketplace

A platform where users can discover, subscribe to, and use various APIs. The system includes user authentication, API management, and a credit-based payment system.

## Features

- User Authentication (Register, Login, JWT)
- Role-based Access Control (Admin & User)
- Credit-based API Usage System
- API Management & Discovery
- API Usage Analytics
- Protected Routes & Endpoints
- Swagger API Documentation

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- React
- TypeScript
- Material-UI
- Redux Toolkit
- React Router

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/guptaabhay11/free-api.git
cd free-api
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend/my-app
npm install
```

4. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/api-marketplace
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend/my-app
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It provides detailed information about:
- Available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

## Features in Detail

### User Management
- User registration with email and password
- User login with JWT authentication
- Role-based access control (Admin/User)
- User profile management

### API Management
- Create and manage APIs (Admin only)
- Set pricing per API request
- API subscription system
- API usage tracking

### Credit System
- Credit-based payment for API usage
- Credit balance management
- Transaction history

### Security
- JWT-based authentication
- Protected routes
- Role-based authorization
- Secure password handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 