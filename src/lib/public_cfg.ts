import { PUBLIC_FLOATIMER_TIMEZONE } from "$env/static/public";

if (!PUBLIC_FLOATIMER_TIMEZONE || typeof PUBLIC_FLOATIMER_TIMEZONE != "string") {
	throw new Error("Missing FLOATIMER_TIMEZONE");
}

export type PublicConfig = {
	TIMEZONE: string
}

export const public_cfg: PublicConfig = {
	TIMEZONE: PUBLIC_FLOATIMER_TIMEZONE
};
