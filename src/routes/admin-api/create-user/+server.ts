import { json, error, fail, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

type RequestField = {
	username: string | undefined,
	email: string | undefined,
	password: string | undefined
}

// @ts-ignore: false positive
export const POST = async ({ request }) => {
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
		})
	} catch (error) {
		if (error instanceof APIError) {
			return fail(400, { message: error.message || "Registration failed" })
		}
		return fail(500, { message: "Unexpected server error" });
	}

	return json({ ok: true });
}
