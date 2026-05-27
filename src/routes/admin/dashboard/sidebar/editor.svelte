<script lang="ts">
	import type { timers } from "$lib/server/db/timers.schema";
	import type { BuildQueryResult, InferSelectModel } from "drizzle-orm";
	import Empty from "./empty.svelte";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import type { DB } from "better-auth/adapters/drizzle";
	import type { subjects } from "$lib/server/db/subjects.schema";
	import AddTimerCard from "./add-timer-card.svelte";
	import EditTimerDialog from "./edit-timer-dialog.svelte";

	let {
		subjectsData,
		timersData,
		date,
	}: {
		subjectsData: Array<InferSelectModel<typeof subjects>>;
		timersData: any;
		date: Date;
	} = $props();
</script>

{#if timersData.length > 0}
	<div
		class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 overflow-x-auto items-start"
	>
		{#each timersData as timer (timer.id)}
			<Card.Root>
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
						<b>
							Waktu:
							{String(timer.time_start.getHours()).padStart(
								2,
								"0",
							)}:{String(timer.time_start.getMinutes()).padStart(2, "0")}
							-
							{String(timer.time_end.getHours()).padStart(
								2,
								"0",
							)}:{String(timer.time_end.getMinutes()).padStart(2, "0")}
						</b>
					</p>
				</Card.Content>
				<Card.Footer class="flex-col gap-2">
					<EditTimerDialog
						{date}
						{subjectsData}
						defaultName={timer.name}
						defaultStartTime={`${String(timer.time_start.getHours()).padStart(2, "0")}:${String(timer.time_start.getMinutes()).padStart(2, "0")}`}
						defaultEndTime={`${String(timer.time_end.getHours()).padStart(2, "0")}:${String(timer.time_end.getMinutes()).padStart(2, "0")}`}
						defaultSubject={timer.subject}
						timerId={timer.id}
					/>
					<Button variant="destructive" class="w-full">Hapus</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
		<AddTimerCard {subjectsData} {date} formAction="?/addTimer" />
	</div>
{:else}
	<Empty {subjectsData} {date} />
{/if}
