# CabLink Copilot Instructions

## Project Overview

**CabLink** is a Cab Aggregator microservices platform (similar to Uber/Yandex.Taxi) built with NestJS, PostgreSQL, and Prisma. This document guides AI agents on contributing productively to this codebase.

---

## Architecture & Structure

### Core Services

- **Auth Service** (`server/service/auth-service/`): Handles user authentication, registration, JWT tokens, refresh token management using Prisma ORM and PostgreSQL

### Key Patterns

1. **Module-based architecture**: Each feature (Auth, Users) is organized as a NestJS module with Service, Controller, and DTO layers
2. **Data layer**: Uses Prisma ORM with PostgreSQL adapter; generated types live in `src/generated/prisma/`
3. **Service layer**: Business logic in `.service.ts` files; controllers delegate to services
4. **DTO validation**: Uses `class-validator` decorators; DTOs are interfaces for request/response contracts

### Database Schema (Prisma)

```prisma
User:
  - id (UUID, primary key)
  - email (unique)
  - password (hashed with bcrypt)
  - name (optional)
  - role (enum: USER, PASSENGER, DRIVER, ADMIN, SUPPORT)
  - createdAt (timestamp)
  - tokens[] (relationship to RefreshToken)

RefreshToken:
  - id, tokenHash, userId, expiresAt, revoked, createdAt
  - Cascade delete on user deletion
```

---

## Development Workflows & Commands

### Prisma Migrations

```bash
npm run prisma:generate    # Regenerate Prisma client types
npm run prisma:migrate     # Create & apply migration
npm run prisma:reset       # Reset database (dev only!)
npm run prisma:studio      # Open Prisma Studio UI
```

### Building & Testing

```bash
npm run build              # Compile TypeScript to dist/
npm run start:dev          # Run with hot-reload
npm run test               # Jest unit tests
npm run test:e2e           # End-to-end tests
npm run test:cov           # Coverage report
npm run lint               # ESLint with auto-fix
```

### **Important Note on Core Components**

⚠️ **DO NOT modify core service/controller files directly** - only write tests for them. When fixing bugs or adding features to existing services, update corresponding `.spec.ts` test files instead.

---

## Code Patterns & Conventions

### Service Layer

- Services are `@Injectable()` singletons
- Constructor injection for dependencies (PrismaService, JwtService, etc.)
- Methods are typically `async`; always use `await` for Prisma operations
- Always validate inputs and throw appropriate NestJS exceptions

**Example** (`users.service.ts`):

```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existing) throw new BadRequestException("User already exists");

    const hashed = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: { ...createUserDto, password: hashed },
    });
  }
}
```

### DTOs & Validation

- Use `class-validator` decorators for type safety and runtime validation
- DTOs live in `feature/dto/` folders
- Combine `@nestjs/mapped-types` for update DTOs (reuse creation DTOs with optional fields)

**Example** (`create-user.dto.ts`):

```typescript
import { IsEmail, IsString, MinLength, IsEnum } from "class-validator";
import { UserRole } from "../../generated/prisma/enums";

export class CreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsEnum(UserRole) role: UserRole;
}
```

### Controllers

- Controllers map HTTP routes to service methods
- Minimal business logic; delegate to services
- Use decorators: `@Controller()`, `@Get()`, `@Post()`, `@UseGuards(JwtAuthGuard)`

### PrismaService

- Always extends `PrismaClient` for type inheritance
- Include lifecycle hooks: `onModuleInit()` to connect, `onModuleDestroy()` to disconnect
- Use PostgreSQL adapter: `new PrismaPg({ connectionString })`

### Authentication

- JWT-based with refresh tokens stored in database
- Refresh tokens are bcrypt-hashed; stored hash in DB, not plaintext token
- `JwtAuthGuard` validates access tokens; can be applied to routes with `@UseGuards(JwtAuthGuard)`
- Cookies store refresh tokens with `httpOnly: true, secure: true (prod), sameSite: 'strict'`

---

## Error Handling & Exceptions

Use NestJS built-in exceptions:

```typescript
BadRequestException; // 400: Validation, business logic failures
UnauthorizedException; // 401: Auth token invalid/missing
ForbiddenException; // 403: User lacks permission
NotFoundException; // 404: Resource not found
InternalServerErrorException; // 500: Unhandled errors
```

**Pattern**:

```typescript
if (!user) throw new NotFoundException("User not found");
if (condition) throw new BadRequestException("Invalid input");
```

---

## Testing Strategy

### Unit Tests

- Test services in isolation; mock dependencies (e.g., `jest.mock(PrismaService)`)
- Test DTOs with validators
- Files: `*.service.spec.ts`, `*.controller.spec.ts`

### E2E Tests

- Test full request→response flow including HTTP and database
- Located in `test/jest-e2e.json`
- Use real database or test fixtures

---

## Key Files & Their Purpose

| File                                | Purpose                                                  |
| ----------------------------------- | -------------------------------------------------------- |
| `src/app.module.ts`                 | Root module; imports all feature modules                 |
| `src/prisma/prisma.service.ts`      | DB connection singleton; extends PrismaClient            |
| `src/auth/auth.service.ts`          | JWT generation, login, register, token refresh logic     |
| `src/users/users.service.ts`        | User CRUD operations with bcrypt hashing                 |
| `src/auth/guards/jwt-auth.guard.ts` | Validates JWT tokens on protected routes                 |
| `prisma/schema.prisma`              | Database schema definition; run migrations after changes |
| `src/generated/prisma/`             | Auto-generated Prisma types (DO NOT edit manually)       |

---

## Common Tasks

### Adding a New Feature

1. Create feature module: `src/feature/feature.module.ts`
2. Create service: `src/feature/feature.service.ts` (business logic)
3. Create controller: `src/feature/feature.controller.ts` (routes)
4. Create DTOs: `src/feature/dto/*.dto.ts` (validation)
5. Import module in `app.module.ts`
6. Write tests for service: `feature.service.spec.ts`

### Modifying Database Schema

1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate` with a descriptive name
3. Regenerate types: `npm run prisma:generate`
4. Update services/controllers to use new fields

### Fixing Type Errors

- If `Property 'X' does not exist on type 'PrismaService'`: Ensure PrismaService extends PrismaClient correctly
- If `Unsafe return of value of type error`: Add proper error handling with typed exceptions
- Run `npm run lint` to catch TypeScript/ESLint issues before submitting

---

## Git Workflow

- Current branch: `development`
- Default branch: `main`
- Create feature branches from `development`
- Follow conventional commits: `feat:`, `fix:`, `test:`, `refactor:`

---

## When Stuck

1. Check existing test files (`.spec.ts`) for usage patterns
2. Review auth flow in `auth.service.ts` and `auth.controller.ts`
3. Run `npm run test:e2e` to verify full request flow
4. Check Prisma schema for available fields/relationships
5. Use `npm run prisma:studio` to inspect live data
