import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const timers = pgTable('timers', {
	id: serial('id').primaryKey().unique(),
	subject: serial('subject').references()
	priority: integer('priority').notNull().default(1)
});
