# API Gateway Service

**CabLink** - Microservices-based ride-hailing platform

## Overview

The API Gateway is the entry point for all client requests in the CabLink microservices architecture. It routes incoming requests to appropriate backend services (Auth Service, Passenger Service, etc.) and handles cross-cutting concerns like authentication, request aggregation, and response transformation.

## Features

- **Request Routing** - Forwards requests to appropriate microservices
- **Authentication Proxy** - Delegates authentication to Auth Service
- **User Management** - Handles user-related API requests
- **Bookings Management** - Routes booking-related requests
- **Payments Management** - Routes payment-related requests
- **Cookie Handling** - Manages refresh token cookies for secure authentication

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client    │────▶│  API Gateway    │────▶│  Auth Service   │
│             │     │  (Port: 3000)   │     │  (Port: 3001)   │
└─────────────┘     └─────────────────┘     └─────────────────┘
                           │
                           ├────▶ Passenger Service
                           │
                           ├────▶ Bookings Service
                           │
                           └────▶ Payments Service
```

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **HTTP Client**: @nestjs/axios
- **Cookie Management**: cookie-parser
- **Validation**: class-validator, class-transformer

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | User logout |

### Users (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PATCH | `/api/users/:id` | Update user |

### Bookings (`/api/bookings`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get booking by ID |
| PATCH | `/api/bookings/:id` | Update booking |

### Payments (`/api/payments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments` | Get all payments |
| POST | `/api/payments` | Create payment |
| GET | `/api/payments/:id` | Get payment by ID |

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
PASSENGER_SERVICE_URL=http://localhost:3002
```

## Running the Service

```bash
# Development mode (watch mode)
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## Build

```bash
# Build for production
npm run build
```

## Project Structure

```
src/
├── auth/           # Authentication module (proxy to Auth Service)
├── users/          # User management module
├── bookings/       # Booking management module
├── payments/       # Payment management module
├── shared/         # Shared utilities and helpers
├── app.module.ts   # Root module
├── app.controller.ts
├── app.service.ts
└── main.ts         # Application entry point
```

## License

UNLICENSED

---

**CabLink** - Connecting riders and drivers seamlessly
