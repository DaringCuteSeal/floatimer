import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(migrationClient);

async function runMigrations() {
	console.log("Running database migrations...");

	await migrate(db, { migrationsFolder: "./drizzle" });

	console.log("Migrations applied successfully!");
	await migrationClient.end();
	process.exit(0);
}

runMigrations().catch((err) => {
	console.error("Migration failed:", err);
	process.exit(1);
});
