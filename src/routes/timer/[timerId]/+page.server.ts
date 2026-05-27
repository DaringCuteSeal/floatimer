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
	let timerId = event.params.timerId;
	let timerIdNum = Number(timerId);
	if (isNaN(timerIdNum)) {
		return error(400, "ID timer tidak valid");
	}

	let timerItem: InferSelectModel<typeof timers> | undefined;
	// idk if it's supposed to throw an error but uh sure
	try {
		timerItem = await db.query.timers.findFirst({
			where: (timers, { eq }) => {
				eq(timers.id, timerIdNum)
			}
		})
	} catch {
		return error(500, "Gagal untuk mendapatkan informasi timer");
	}

	if (timerItem == undefined) {
		// is this the server's fault or the client's?
		return error(400, "Timer tidak ditemukan");
	}

	// also send server time
	const now = new Date();

	return { timerInfo: timerItem, time: now }

};
