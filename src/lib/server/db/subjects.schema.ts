import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const subjects = pgTable('subjects', {
	id: serial('id').primaryKey().unique(),
	name: varchar("name", { length: 100 }),
});
