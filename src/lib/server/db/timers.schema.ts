import { pgTable, serial, text, time, timestamp, varchar } from "drizzle-orm/pg-core";
import { subjects } from "./subjects.schema";

export const timers = pgTable('timers', {
	id: serial('id').primaryKey().unique(),
	subject: serial('subject').references(() => subjects.id),
	name: varchar('name', { length: 100 }),
	time_start: timestamp("time_start", { precision: 6, withTimezone: true }),
	time_end: timestamp("time_end", { precision: 6, withTimezone: true }),
});
