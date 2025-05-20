# Car Repair Payment Management System - Backend

This is the backend server for the Car Repair Payment Management System (CRPMS). It provides RESTful APIs for managing cars, services, service records, and payments.

## Technologies Used

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- bcrypt.js

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Navigate to the backend project directory:
   ```bash
   cd backend-project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=crpms
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
5. Create the MySQL database:
   ```sql
   CREATE DATABASE crpms;
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Cars

- `POST /api/cars` - Create a new car (Protected)
- `GET /api/cars` - Get all cars (Protected)
- `GET /api/cars/:id` - Get car by ID (Protected)
- `PUT /api/cars/:id` - Update car (Protected)
- `DELETE /api/cars/:id` - Delete car (Protected)

### Services

- `POST /api/services` - Create a new service (Protected)
- `GET /api/services` - Get all services (Protected)
- `GET /api/services/:id` - Get service by ID (Protected)
- `PUT /api/services/:id` - Update service (Protected)
- `DELETE /api/services/:id` - Delete service (Protected)

### Service Records

- `POST /api/service-records` - Create a new service record (Protected)
- `GET /api/service-records` - Get all service records (Protected)
- `GET /api/service-records/:id` - Get service record by ID (Protected)
- `PUT /api/service-records/:id` - Update service record (Protected)
- `DELETE /api/service-records/:id` - Delete service record (Protected)
- `GET /api/service-records/car/:carId` - Get service records by car ID (Protected)

### Payments

- `POST /api/payments` - Create a new payment (Protected)
- `GET /api/payments` - Get all payments (Protected)
- `GET /api/payments/:id` - Get payment by ID (Protected)
- `PUT /api/payments/:id` - Update payment (Protected)
- `DELETE /api/payments/:id` - Delete payment (Protected)
- `GET /api/payments/service-record/:serviceRecordId` - Get payments by service record ID (Protected)

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Authentication

All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Development

To start the development server with nodemon:

```bash
npm run dev
```

## Production

To start the production server:

```bash
npm start
``` 