<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import House from "@lucide/svelte/icons/house";
	import waves from "$lib/assets/waves.webm";
	import Timer from "@lucide/svelte/icons/timer";
	import * as Card from "$lib/components/ui/card/";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";
	import { public_cfg } from "$lib/public_cfg";
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import { onMount } from "svelte";
	import Watermark from "$lib/components/ui/watermark/watermark.svelte";

	const { data } = $props();

	let currentTime = $state(new Date(data.time));
	let totalTime = $derived(
		data.timerInfo.time_end.getTime() - data.timerInfo.time_start.getTime(),
	);
	let durationLeft = $derived(
		data.timerInfo.time_end.getTime() - currentTime.getTime(),
	);

	// fake enum
	const ExamState = {
		NOT_STARTED: 0,
		RUNNING: 1,
		ENDED: 2,
	} as const;

	type ExamState = (typeof ExamState)[keyof typeof ExamState];

	function getExamState(): ExamState {
		if (
			currentTime.getTime() >= data.timerInfo.time_start.getTime() &&
			currentTime.getTime() < data.timerInfo.time_end.getTime()
		) {
			return ExamState.RUNNING;
		} else if (currentTime.getTime() < data.timerInfo.time_start.getTime()) {
			return ExamState.NOT_STARTED;
		} else {
			return ExamState.ENDED;
		}
	}

	let effectsEnabled = $derived(false);
	let examState = $derived(getExamState());
	let timerProgress = $derived(() => {
		const left = data.timerInfo.time_end.getTime() - currentTime.getTime();
		const raw = 1 - left / totalTime;
		// this is a clamp. not really needed since we don't ever encounter the progress screen if we're not doing the exam anyway but uh..
		return Math.min(Math.max(raw, 0), 1);
	});

	const timeFormatter = new Intl.DateTimeFormat("en-US", {
		timeZone: public_cfg.TIMEZONE,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});

	onMount(() => {
		const interval = setInterval(() => {
			// put all update code here
			currentTime = new Date(currentTime.getTime() + 1000);
		}, 1000);

		return () => clearInterval(interval);
	});

	onMount(() => {
		// refresh the page data every minute
		const interval = setInterval(() => {
			invalidateAll();
		}, 10000);

		return () => clearInterval(interval);
	});

	$effect(() => {
		currentTime = new Date(data.time);
	});

	// format duration, with input given as duration (in milliseconds)
	function formatDuration(ms: number): string {
		const h = Math.floor(ms / 3600000);
		const m = Math.floor((ms % 3600000) / 60000);
		const s = Math.floor((ms % 60000) / 1000);
		return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	}
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

<div class="fixed top-10 left-10">
	<a href="/" aria-label="Go to homepage">
		<Button variant="outline"><House /></Button>
	</a>
</div>

<div class="fixed bottom-10 right-10">
	<div class="flex flex-row gap-3">
		<Switch id="effects" bind:checked={effectsEnabled} />
		<Label for="effects">Kolam berenang</Label>
	</div>
</div>

<div
	class="w-screen h-screen flex-1 flex flex-col p-8 gap-10 bg h-screen justify-center items-center"
	style="--progress: {timerProgress()}"
>
	{#if effectsEnabled}
		<div class="wave-bg">
			<div class="wave-fill"></div>

			<video class="wave-video" autoplay loop muted>
				<source src={waves} />
			</video>
		</div>
	{/if}
	<div
		class="flex flex-col p-8 gap-10 bg h-screen justify-center items-center"
	>
		{#if examState == ExamState.RUNNING}
			<p class="text-center text-[clamp(1rem,1vw,2rem)]">
				<b>{data.timerInfo.name}</b> ({data.timerInfo.subject.name})
			</p>
			<Card.Root class="h-fit w-6/10 [--card:rgba(20,20,25,0.2)]">
				<p class="text-center text-[clamp(1rem,2vw,3rem)]">Sekarang Jam</p>

				<p class="text-center text-[clamp(1rem,4vw,5rem)] font-mono">
					{timeFormatter.format(currentTime)}
				</p>
			</Card.Root>
			<Card.Root class="w-full h-fit m-10 [--card:rgba(20,20,25,0.2)]">
				<p class="text-center text-[clamp(1rem,2vw,3rem)]">Sisa Waktu</p>
				<p class="text-center text-[clamp(2rem,10vw,29rem)] font-mono">
					{formatDuration(durationLeft)}
				</p>
			</Card.Root>
		{:else if examState == ExamState.NOT_STARTED}
			<p class="text-center text-[clamp(1rem,3vw,6rem)]">
				Ujian belum dimulai.
			</p>
		{:else if examState == ExamState.ENDED}
			<p class="text-center text-[clamp(1rem,3vw,6rem)]">
				Ujian sudah selesai!
			</p>
		{/if}
	</div>

	<Watermark />
</div>

<style lang="scss">
	.wave-bg {
		position: fixed;
		inset: 0;
		z-index: -2;
		overflow: hidden;
		background: transparent;
	}

	/* bottom solid color that grows */
	.wave-fill {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: calc(var(--progress) * 100% - 7rem);
		background: rgba(61, 130, 178, 1);
		transition: height 0.3s linear;
	}

	/* wave surface */
	.wave-video {
		position: absolute;
		left: 0;
		bottom: calc(var(--progress) * 100% - 7rem);
		width: 100%;
		height: 40vh;
		object-fit: cover;
		opacity: 1;
		transition: bottom 0.3s linear;
	}
</style>
