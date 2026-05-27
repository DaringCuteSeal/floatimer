import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/subjects.schema';
import { eq, gte, lt, type InferSelectModel } from 'drizzle-orm';
import { timers } from '$lib/server/db/timers.schema';
import { CalendarDate, parseAbsolute, parseDate, today, ZonedDateTime, type DateValue } from "@internationalized/date";
import { public_cfg } from '$lib/public_cfg';
import { dateFormatMachine } from '$lib/utils';

function combineDateAndTime(
	inputDate: ZonedDateTime,
	time: string,
): Date {
	const [hour, minute] = time.split(":").map(Number);
	if (isNaN(hour) || isNaN(minute)) {
		throw Error("time format not correct");
	}

	const updated = inputDate.set({
		hour,
		minute,
		second: 0,
		millisecond: 0
	});

	return updated.toDate();
}

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
	addTimer: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const date = formData.get('date')?.toString() ?? '';
		const startTime = formData.get('time_start')?.toString() ?? '';
		const endTime = formData.get('time_end')?.toString() ?? '';
		const subjectId = formData.get('subject_id')?.toString() ?? NaN;
		const subjectIdNum = Number(subjectId)
		if (isNaN(subjectIdNum)) {
			return error(400, "ID mata pelajaran tidak ditemukan dalam database!")
		}

		let startDate: DateValue;
		let endDate: DateValue;
		try {
			startDate = parseAbsolute(date, public_cfg.TIMEZONE);
			endDate = startDate;
		} catch {
			return error(400, "Tanggal tidak valid!")
		}

		let startDateTime;
		let endDateTime;
		try {
			startDateTime = combineDateAndTime(startDate, startTime);
			endDateTime = combineDateAndTime(endDate, endTime);
		} catch {
			return error(400, "Format waktu tidak valid!")
		}

		try {
			await db.insert(timers).values({
				name,
				subject: subjectIdNum,
				time_start: startDateTime,
				time_end: endDateTime
			})
		} catch (err) {
			return error(500, "Gagal menambahkan timer!");
		}
	},
	editTimer: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? NaN;
		const idNum = Number(id);
		const name = formData.get('name')?.toString() ?? '';
		const date = formData.get('date')?.toString() ?? '';
		const startTime = formData.get('time_start')?.toString() ?? '';
		const endTime = formData.get('time_end')?.toString() ?? '';
		const subjectId = formData.get('subject_id')?.toString() ?? NaN;
		const subjectIdNum = Number(subjectId)

		if (isNaN(idNum)) {
			return error(400, "ID timer tidak ditemukan dalam database!")
		}
		if (isNaN(subjectIdNum)) {
			return error(400, "ID mata pelajaran tidak ditemukan dalam database!")
		}

		let startDate: DateValue;
		let endDate: DateValue;
		try {
			startDate = parseAbsolute(date, public_cfg.TIMEZONE);
			endDate = startDate;
		} catch {
			return error(400, "Tanggal tidak valid!")
		}

		let startDateTime;
		let endDateTime;
		try {
			startDateTime = combineDateAndTime(startDate, startTime);
			endDateTime = combineDateAndTime(endDate, endTime);
		} catch {
			return error(400, "Format waktu tidak valid!")
		}

		try {
			await db.update(timers).set({
				name,
				subject: subjectIdNum,
				time_start: startDateTime,
				time_end: endDateTime
			}).where(eq(timers.id, idNum));
		} catch (err) {
			return error(500, "Gagal menyunting timer!");
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
			},
			orderBy: (timers, { asc }) => [asc(timers.id)]
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

	return { user: event.locals.user, subjects: subjectsData, timers: timersData, date: targetDate.toDate(public_cfg.TIMEZONE), thisDay: today(public_cfg.TIMEZONE).toDate(public_cfg.TIMEZONE), dateWithTimers: timerCountsData };
};
