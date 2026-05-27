import type { DateValue } from "@internationalized/date";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

// follows ISO 8601 format
export function dateFormatMachine(date: Date): string {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-base indexed
	const year = date.getFullYear();
	return `${year}-${month}-${day}`
}

// follows ISO 8601 format
export function dateValueFormatMachine(date: DateValue): string {
	const day = String(date.day).padStart(2, '0');
	const month = String(date.month).padStart(2, '0');
	return `${date.year}-${month}-${day}`
}
