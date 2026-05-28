import { parseDate, today, type CalendarDate } from "@internationalized/date";
import type { PageServerLoad } from "./$types";
import { public_cfg } from "$lib/public_cfg";
import type { InferSelectModel } from "drizzle-orm";
import type { timers } from "$lib/server/db/timers.schema";
import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { dateFormatMachine } from "$lib/utils";

// TODO: same as admin page's load function, refactor later.
export const load: PageServerLoad = async (event) => {
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

	let baseDate = targetDate.toDate(public_cfg.TIMEZONE);
	let startDate = new Date(baseDate);
	startDate.setHours(0, 0, 0, 0);

	let endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 1);

	let timersData;

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

	return { timers: timersData, date: targetDate.toDate(public_cfg.TIMEZONE), thisDay: today(public_cfg.TIMEZONE).toDate(public_cfg.TIMEZONE), dateWithTimers: timerCountsData };
};
