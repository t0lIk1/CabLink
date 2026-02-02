import {
  pgTable,
  uuid,
  varchar,
  decimal,
  timestamp,
} from 'drizzle-orm/pg-core';

export const passengers = pgTable('passengers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('5.00'),
  totalRides: decimal('total_rides').default('0'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export type Passenger = typeof passengers.$inferSelect;
export type NewPassenger = typeof passengers.$inferInsert;
