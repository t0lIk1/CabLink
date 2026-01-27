# Использование JwtAuthGuard в нескольких микросервисах

## 1. Структура Guard'а

Guard проверяет наличие JWT токена в заголовке `Authorization: Bearer <token>` и проверяет его валидность.

## 2. Использование в текущем микросервисе (auth-service)

```typescript
// В контроллере
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @Post('data')
  @UseGuards(JwtAuthGuard)
  async getData(@Req() req: Request) {
    const userId = req.user.sub; // Из JWT payload
    return { message: `User ${userId}` };
  }
}
```

## 3. Использование в других микросервисах

Для использования guard в других микросервисах, вам нужно:

### Шаг 1: Установить зависимости

```bash
npm install @nestjs/jwt
```

### Шаг 2: Импортировать AuthModule в другом микросервисе

```typescript
// other-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from '@cablink/auth-shared'; // или импортировать прямо

@Module({
  imports: [
    AuthModule, // Или JwtModule из auth-service
    // другие модули
  ],
})
export class AppModule {}
```

### Шаг 3: Использовать guard в других сервисах

```typescript
// other-service/src/orders/orders.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '@cablink/auth-service'; // или локальный guard
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(@Req() req: Request) {
    const userId = req.user.sub;
    // Получить заказы пользователя
  }
}
```

## 4. Альтернатива: Создать общую библиотеку guard'ов

Если у вас много микросервисов, рекомендую создать общий пакет:

### Структура:

```
shared/
  auth-guards/
    src/
      guards/
        jwt-auth.guard.ts
        jwt-auth.module.ts
      index.ts
    package.json
```

### shared/auth-guards/src/index.ts

```typescript
export { JwtAuthGuard } from './guards/jwt-auth.guard';
export { AuthGuardModule } from './guards/jwt-auth.module';
```

### Затем в package.json добавить:

```json
{
  "name": "@cablink/auth-guards",
  "version": "1.0.0",
  "main": "dist/index.js"
}
```

### Использование в других сервисах:

```typescript
import { JwtAuthGuard, AuthGuardModule } from '@cablink/auth-guards';
```

## 5.环境переменные

Убедитесь, что в каждом микросервисе установлены одинаковые переменные:

```env
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

## 6. Расширение Guard'а с дополнительной логикой

Если нужна проверка roles:

```typescript
import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const isAuthenticated = super.canActivate(context);
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    const requiredRoles = Reflect.getMetadata('roles', context.getHandler());

    if (!requiredRoles) return true;

    return requiredRoles.includes(request.user.role);
  }
}
```

Использование:

```typescript
@Post('admin')
@UseGuards(RolesGuard)
@Roles('admin')
async adminAction() {
  // только для админов
}
```
