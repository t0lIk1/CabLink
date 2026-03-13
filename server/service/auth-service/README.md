# Auth Service

**CabLink** - Microservices-based ride-hailing platform

## Overview

The Auth Service handles all authentication and authorization concerns for the CabLink platform. It manages user registration, login, JWT token issuance, refresh token rotation, and user role management.

## Features

- **User Registration** - Create new user accounts with role assignment
- **User Authentication** - Login with email/password credentials
- **JWT Token Management** - Issue and validate access tokens
- **Refresh Token Rotation** - Secure token refresh with rotation
- **Role-Based Access Control** - Support for multiple user roles (USER, PASSENGER, DRIVER, ADMIN, SUPPORT)
- **Password Hashing** - bcrypt password hashing for security
- **Token Revocation** - Logout and token invalidation

## User Roles

| Role | Description |
|------|-------------|
| `USER` | Basic user account |
| `PASSENGER` | Passenger role for booking rides |
| `DRIVER` | Driver role for accepting rides |
| `ADMIN` | Administrative access |
| `SUPPORT` | Customer support access |

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT (passport-jwt)
- **Password Hashing**: bcrypt
- **Validation**: class-validator, class-transformer

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'USER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | User logout (revoke token) |

### Request/Response Examples

#### Register

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "PASSENGER"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/cablink_auth

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
```

## Database Setup

```bash
# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push

# Drop database tables
npm run db:drop

# Open Drizzle Studio (database GUI)
npm run db:studio
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
├── auth/
│   ├── decorators/       # Custom auth decorators (@Roles, @User)
│   ├── dtos/             # Data transfer objects (RegisterDto, LoginDto)
│   ├── guards/           # Auth guards (JwtAuthGuard, RolesGuard)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── dto/              # User DTOs
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── database/
│   ├── database.module.ts
│   └── database.service.ts
├── schema.ts             # Database schema definitions
├── app.module.ts
└── main.ts
```

## Security Considerations

- **Password Storage**: All passwords are hashed using bcrypt with 10 salt rounds
- **Token Security**: Refresh tokens are stored as hashes in the database
- **Token Rotation**: Refresh tokens are rotated on each use (one-time use)
- **Cookie Security**: Refresh tokens are stored in httpOnly, secure cookies
- **Token Expiry**: Access tokens expire after 15 minutes, refresh tokens after 7 days

## License

UNLICENSED

---

**CabLink** - Connecting riders and drivers seamlessly
