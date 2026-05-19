import { betterAuth } from 'better-auth/minimal';
import { i18n } from "@better-auth/i18n";
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	rateLimit: {
		enabled: true,
		window: 10, // time window in seconds
		max: 10, // max requests in the window
	},
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true },
	plugins: [
		i18n({
			defaultLocale: "id",
			detection: ["header", "cookie"], // Methods to check for locale
			translations: {
				id: {
					USER_NOT_FOUND: "Akun tidak ditemukan",
					INVALID_EMAIL_OR_PASSWORD: "Email atau sandi tidak benar",
					INVALID_PASSWORD: "Sandi tidak benar",
					INVALID_EMAIL: "Email tidak valid"
				}
			},
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
