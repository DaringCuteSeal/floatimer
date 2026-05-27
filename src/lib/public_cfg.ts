import { env } from "$env/dynamic/public";

export type PublicConfig = {
	TIMEZONE: string
	TITLE: string
}

export const public_cfg: PublicConfig = {
	TIMEZONE: env.PUBLIC_FLOATIMER_TIMEZONE,
	TITLE: !env.PUBLIC_TITLE ? "Floatimer" : env.PUBLIC_TITLE
};
