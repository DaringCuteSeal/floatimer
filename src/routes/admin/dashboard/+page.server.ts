import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/subjects.schema';
import { eq, gte, lt, type InferSelectModel } from 'drizzle-orm';
import { timers } from '$lib/server/db/timers.schema';
import { CalendarDate, parseDate, today } from "@internationalized/date";
import { public_cfg } from '$lib/public_cfg';
import { dateFormatMachine } from '$lib/utils';

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/admin/login');
	},
	renameSubject: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? NaN;
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
		const id = formData.get('id')?.toString() ?? NaN;
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
	},
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/admin/login');
	}

	// get the target date by the url parameter, or set to today (based on the set time zone) as a fallback
	let targetDate: CalendarDate;
	let urlDate = event.url.searchParams.get("date");

	if (urlDate == null) {
		targetDate = today(public_cfg.TIMEZONE);
	} else {
		try {
			targetDate = parseDate(urlDate);
		} catch {
			targetDate = today(public_cfg.TIMEZONE);
		}
	}

	let startDate = targetDate.toDate(public_cfg.TIMEZONE);
	let endDate = targetDate.toDate(public_cfg.TIMEZONE);
	endDate.setDate(startDate.getDate() + 1);

	let timersData: Array<InferSelectModel<typeof timers>>;

	try {
		timersData = await db.query.timers.findMany({
			where: (timers, { and, gte, lt }) =>
				and(
					gte(timers.time_start, startDate),
					lt(timers.time_end, endDate)
				),

			with: {
				subject: true
			}
		});
	} catch (err) {
		return error(500, "Gagal mendapatkan daftar timer!");
	}

	let subjectsData: Array<InferSelectModel<typeof subjects>>;

	try {
		subjectsData = await db.query.subjects.findMany({ orderBy: (subjects, { desc }) => [desc(subjects.id), desc(subjects.name)], });
	} catch (err) {
		return error(500, "Gagal mendapatkan daftar mata pelajaran!");
	}

	// TODO: double query lol
	// at first i thought that loading all timers would not be optimal but then
	// i realize i also need to display which dates have timers
	// so i just slapped this API which hopefully should be lightweight enough
	let timerDates;

	try {
		timerDates = await db.query.timers.findMany({
			columns: {
				time_start: true
			}
		});
	} catch (err) {
		return error(500, "Gagal mendapatkan daftar timer!");
	}

	let timerCountsData = new Set<string>;
	for (const t of timerDates) {
		timerCountsData.add(dateFormatMachine(t.time_start));

	}

	return { user: event.locals.user, subjects: subjectsData, timers: timersData, date: targetDate.toDate(public_cfg.TIMEZONE), dateWithTimers: timerCountsData };
};
