import { env } from "$env/dynamic/public";

if (!env.PUBLIC_FLOATIMER_TIMEZONE || typeof env.PUBLIC_FLOATIMER_TIMEZONE != "string") {
	throw new Error("Missing FLOATIMER_TIMEZONE");
}

export type PublicConfig = {
	TIMEZONE: string
	TITLE: string
}

export const public_cfg: PublicConfig = {
	TIMEZONE: env.PUBLIC_FLOATIMER_TIMEZONE,
	TITLE: !env.PUBLIC_TITLE ? "Floatimer" : env.PUBLIC_TITLE
};
