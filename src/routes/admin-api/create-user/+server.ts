import { json, error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

type RequestField = {
	username: string | undefined,
	email: string | undefined,
	password: string | undefined
}

export const POST: RequestHandler = async ({ request }) => {
	const key = request.headers.get("x-api-key");

	if (!key || key !== env.ADMIN_API_KEY) {
		throw error(401, "Unauthorized");
	}

	let requestData: RequestField;
	try {
		requestData = await request.json();
	}
	catch {
		throw error(400, "Invalid or no JSON data given");
	}

	if (!requestData.username || !requestData.email || !requestData.password) {
		throw error(400, "Incorrect data");
	}

	try {
		await auth.api.signUpEmail({
			body: {
				email: requestData.email,
				password: requestData.password,
				name: requestData.username,
				callbackURL: '/auth/verification-success'
			}
		});
	} catch (err) {
		if (err instanceof APIError) {
			return json(
				{ message: err.message || "Registration failed" },
				{ status: 400 }
			);
		}

		return json(
			{ message: "Unexpected server error" },
			{ status: 500 }
		);
	}

	return json({ ok: true });
}
