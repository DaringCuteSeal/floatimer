import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
	if (!event.locals.user) {
		return redirect(302, '/admin/login');
	}
	return { user: event.locals.user };
};
