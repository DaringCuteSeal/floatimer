import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/subjects.schema';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/admin/login');
	},
	default: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const idNum = Number(id);
		if (isNaN(idNum)) {
			return error(400, "ID mata pelajaran tidak ditemukan dalam database!");
		}

		const newName = formData.get('new_name')?.toString() ?? '';
		let newData;
		try {
			newData = await db.update(subjects)
				.set({ name: newName })
				.where(eq(subjects.id, idNum)).returning()
		} catch (err) {
			return error(500, "Gagal mengupdate nama mata pelajaran!");
		}
		return {
			success: true,
			newData
		}
	}
};

export const load: PageServerLoad = (event) => {
	if (!event.locals.user) {
		return redirect(302, '/admin/login');
	}
	return { user: event.locals.user };
};
