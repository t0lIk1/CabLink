# Passenger Service

**CabLink** - Microservices-based ride-hailing platform

## Overview

The Passenger Service manages passenger profiles and related data for the CabLink ride-hailing platform. It handles passenger information, ratings, ride history, and profile management.

## Features

- **Passenger Profile Management** - Create and update passenger profiles
- **Passenger Lookup** - Retrieve passenger information by user ID
- **Rating System** - Track passenger ratings from drivers
- **Ride History** - Track total number of rides
- **Profile Updates** - Update passenger information

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Database Driver**: postgres (node-postgres)
- **Validation**: class-validator, class-transformer

## Database Schema

### Passengers Table

```sql
CREATE TABLE passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_rides DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique passenger identifier |
| `userId` | UUID | Reference to user account (unique) |
| `firstName` | VARCHAR(100) | Passenger's first name |
| `lastName` | VARCHAR(100) | Passenger's last name |
| `phone` | VARCHAR(20) | Contact phone number |
| `rating` | DECIMAL(3,2) | Passenger rating (0.00-5.00) |
| `totalRides` | DECIMAL | Total number of completed rides |
| `createdAt` | TIMESTAMPTZ | Profile creation timestamp |
| `updatedAt` | TIMESTAMPTZ | Last update timestamp |

## API Endpoints

### Passengers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/passengers` | Create new passenger profile |
| GET | `/passengers` | Get all passengers |
| GET | `/passengers/:userId` | Get passenger by user ID |
| PATCH | `/passengers/:userId` | Update passenger profile |

### Request/Response Examples

#### Create Passenger

```bash
POST /passengers
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

Response:
```json
{
  "id": "uuid",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "rating": "5.00",
  "totalRides": "0",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Get Passenger

```bash
GET /passengers/550e8400-e29b-41d4-a716-446655440000
```

#### Update Passenger

```bash
PATCH /passengers/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "firstName": "Jane",
  "phone": "+0987654321"
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
PORT=3002
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/cablink_passenger
```

## Database Setup

```bash
# Generate database migrations
npm run drizzle:generate

# Run database migrations
npm run drizzle:migrate

# Open Drizzle Studio (database GUI)
npm run drizzle:studio
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
├── passengers/
│   ├── dto/
│   │   ├── create-passenger.dto.ts
│   │   └── update-passenger.dto.ts
│   ├── passengers.controller.ts
│   ├── passengers.service.ts
│   └── passengers.module.ts
├── database/
│   ├── database.module.ts
│   └── database.service.ts
├── schema.ts             # Database schema definitions
├── app.module.ts
└── main.ts
```

## DTOs

### CreatePassengerDto

```typescript
{
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}
```

### UpdatePassengerDto

```typescript
{
  firstName?: string;
  lastName?: string;
  phone?: string;
  rating?: number;
  totalRides?: number;
}
```

## License

UNLICENSED

---

**CabLink** - Connecting riders and drivers seamlessly
