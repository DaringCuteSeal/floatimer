<script lang="ts">
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import { Button } from "$lib/components/ui/button/index.js";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import * as Card from "$lib/components/ui/card";
	import * as Popover from "$lib/components/ui/popover";
	import { Calendar } from "$lib/components/ui/calendar";
	import CircleSmall from "@lucide/svelte/icons/circle-small";
	import Watermark from "$lib/components/ui/watermark/watermark.svelte";
	import {
		CalendarDate,
		fromDate,
		toCalendarDate,
		today,
		type DateValue,
	} from "@internationalized/date";
	import type { PageServerData } from "./$types";
	import { public_cfg } from "$lib/public_cfg";
	import CalendarDay from "$lib/components/ui/calendar/calendar-day.svelte";
	import { dateFormatMachine, dateValueFormatMachine } from "$lib/utils";
	import Label from "$lib/components/ui/label/label.svelte";
	import { goto } from "$app/navigation";
	import { PUBLIC_TITLE } from "$env/static/public";

	let {
		data,
	}: {
		data: PageServerData;
		children: import("svelte").Snippet;
	} = $props();

	let calValue: CalendarDate = $state(
		toCalendarDate(fromDate(data.date, public_cfg.TIMEZONE)),
	);

	let calendarOpen = $state(false);

	const thisDay = toCalendarDate(fromDate(data.thisDay, public_cfg.TIMEZONE));

	$effect(() => {
		goto(`?date=${dateFormatMachine(calValue.toDate(public_cfg.TIMEZONE))}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
		});
	});
</script>

<ModeWatcher />
<Button
	onclick={toggleMode}
	variant="outline"
	size="icon"
	class="fixed bottom-10 left-10"
>
	<SunIcon
		class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
	/>
	<MoonIcon
		class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>

<div class="min-h-screen flex flex-col p-4 bg">
	<h1 class="text-2xl font-bold text-center">{PUBLIC_TITLE}</h1>
	<div class="flex flex-col m-5 gap-5 flex-1">
		<div class="flex justify-center items-center">
			<Popover.Root bind:open={calendarOpen}>
				<Popover.Trigger id="date">
					{#snippet child({ props })}
						<Button
							{...props}
							variant="outline"
							class="w-40 justify-between font-normal"
						>
							<CalendarIcon />
							{calValue
								? calValue
										.toDate(public_cfg.TIMEZONE)
										.toLocaleDateString()
								: "Select date"}
							<ChevronDown />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto overflow-hidden p-0" align="start">
					<Card.Root class="max-w-xl w-full gap-5">
						<Card.Header>
							<Card.Title>Tanggal</Card.Title>
							<Card.Description>Pilih tanggal.</Card.Description>
							<Card.Action>
								<Button
									size="sm"
									variant="outline"
									onclick={() =>
										(calValue = today(public_cfg.TIMEZONE))}
								>
									Hari ini
								</Button>
							</Card.Action>
						</Card.Header>
						<Card.Content>
							<Calendar
								locale="id-ID"
								captionLayout="dropdown"
								value={calValue}
								type="single"
								class="w-full rounded-md [&_table]:w-full [&_td]:w-full [&_th]:w-full"
								onValueChange={(newDate) => {
									if (!newDate) {
										return;
									}
									calValue = toCalendarDate(newDate);
								}}
								minValue={thisDay}
							>
								{#snippet day({ day })}
									{@const existsDate = data.dateWithTimers.has(
										dateValueFormatMachine(day),
									)}
									<CalendarDay class="flex flex-col items-center">
										{day.day}
										{#if existsDate && day.compare(thisDay) >= 0}
											<span>
												<CircleSmall fill="white" size={10} />
											</span>
										{/if}
									</CalendarDay>
								{/snippet}
							</Calendar>
						</Card.Content>
					</Card.Root>
				</Popover.Content>
			</Popover.Root>
		</div>
		{#if data.timers.length > 0}
			<div
				class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-x-auto items-start"
			>
				{#each data.timers as timer (timer.id)}
					<Card.Root class="w-full">
						<Card.Header>
							<Card.Title>
								{#if timer.name == ""}
									<i>Timer Tanpa Nama</i>
								{:else}
									{timer.name}
								{/if}
							</Card.Title>
							<Card.Description>
								{timer.subject?.name}
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>
								Waktu:
								{String(timer.time_start.getHours()).padStart(
									2,
									"0",
								)}:{String(timer.time_start.getMinutes()).padStart(
									2,
									"0",
								)}
								-
								{String(timer.time_end.getHours()).padStart(
									2,
									"0",
								)}:{String(timer.time_end.getMinutes()).padStart(
									2,
									"0",
								)}
							</p>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		{:else}
			<p class="text-center">Tidak ada timer ujian untuk hari ini. Yay!</p>
		{/if}
	</div>
	<Watermark />
</div>

<style>
	:global(.dark) .bg {
		background: linear-gradient(rgba(0, 0, 0, 0.8)),
			url("$lib/assets/drops.png");

		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
		background-position: center;
	}

	.bg {
		background: url("$lib/assets/drops.png");
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
		background-position: center;
	}
</style>
