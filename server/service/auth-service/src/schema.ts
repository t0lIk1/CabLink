// src/db/schema.ts
import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ────────────────────────────────────────────────
// Лучшая практика: выносим значения enum в const массив
// Это позволяет использовать один источник правды для:
// - PostgreSQL enum
// - TypeScript union type
// - class-validator @IsEnum()
// - Zod .enum()
export const USER_ROLES = [
  'USER',
  'PASSENGER',
  'DRIVER',
  'ADMIN',
  'SUPPORT',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

// pgEnum: имя enum в БД → snake_case (стандарт PostgreSQL)
export const userRoleEnum = pgEnum('user_role', USER_ROLES);

// ────────────────────────────────────────────────
// Таблицы: имя таблицы в БД → snake_case (конвенция PostgreSQL)
// Имена колонок в объекте → camelCase (удобно в TS)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(), // храните bcrypt hash!
  name: text('name'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  role: userRoleEnum('role').notNull().default('USER'),
});

// Refresh tokens (snake_case для таблицы и колонок в БД)
export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenHash: text('token_hash').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  revoked: boolean('revoked').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

// ────────────────────────────────────────────────
// Relations (не изменились, они правильные)
export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

// ────────────────────────────────────────────────
// Типы (Drizzle 0.3x+ рекомендует именно $inferSelect / $inferInsert)
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
