import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/subjects.schema';
import { eq, type InferSelectModel } from 'drizzle-orm';

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/admin/login');
	},
	renameSubject: async ({ request }) => {
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
		}
	},
	deleteSubject: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const idNum = Number(id);
		if (isNaN(idNum)) {
			return error(400, "ID mata pelajaran tidak ditemukan dalam database!");
		}

		let newData;
		try {
			newData = await db.delete(subjects).where(eq(subjects.id, idNum));
		} catch (err) {
			return error(500, "Gagal menghapus mata pelajaran!");
		}
		return {
			success: true,
		}
	},
	addSubject: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		try {
			await db.insert(subjects).values({
				name
			});
		} catch (err) {
			return error(500, "Gagal menghapus mata pelajaran!");
		}
	}
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/admin/login');
	}

	let subjectsData: Array<InferSelectModel<typeof subjects>>;
	try {
		subjectsData = await db.query.subjects.findMany({ orderBy: (subjects, { asc, desc }) => [desc(subjects.id), desc(subjects.name)], });
	} catch (err) {
		return error(500, "Gagal mendapatkan daftar mata pelajaran!");
	}
	return { user: event.locals.user, subjects: subjectsData };
};
