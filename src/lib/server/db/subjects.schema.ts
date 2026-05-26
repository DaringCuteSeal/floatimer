import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { timers } from "./timers.schema";

export const subjects = pgTable('subjects', {
	id: serial('id').primaryKey().unique(),
	name: varchar("name", { length: 100 }).notNull(),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
	timers: many(timers)
}));
