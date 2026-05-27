import { pgTable, serial, text, time, timestamp, varchar } from "drizzle-orm/pg-core";
import { subjects } from "./subjects.schema";
import { relations } from "drizzle-orm";

export const timers = pgTable('timers', {
	id: serial('id').primaryKey().unique(),
	subject: serial('subject').notNull().references(() => subjects.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	name: varchar('name', { length: 100 }).notNull(),
	time_start: timestamp("time_start", { precision: 6, withTimezone: true }).notNull(),
	time_end: timestamp("time_end", { precision: 6, withTimezone: true }).notNull(),
});

export const timersRelations = relations(timers, ({ one }) => ({
	subject: one(subjects, {
		fields: [timers.subject],
		references: [subjects.id]
	})
}));
