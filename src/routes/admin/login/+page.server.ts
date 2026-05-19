import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) {
		return redirect(302, '/admin/dashboard/');
	}
	return {};
};

export const actions: Actions = {
	// TODO: add proper rate-limiting
	// the builtin one doesnt work because the login call is done server-side.
	// see: https://better-auth.com/docs/concepts/rate-limit
	signInEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		try {
			await auth.api.signInEmail({
				body: {
					email,
					password,
					callbackURL: '/auth/verification-success'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Sign in gagal' });
			}
			return fail(500, { message: 'Error tidak terduga' });
		}

		return redirect(302, '/admin/');
	},
};
