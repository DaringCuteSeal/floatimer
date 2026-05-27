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
	import AddTimerDialog from "./add-timer-dialog.svelte";

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
	<div class="grid grid-cols-2 md:grid-cols-3 gap-5 overflow-x-auto">
		{#each timersData as timer (timer.id)}
			<Card.Root class="">
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
					<Button type="submit" class="w-full">Sunting</Button>
					<Button variant="destructive" class="w-full">Hapus</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
		<Card.Root class="">
			<Card.Content class="h-full items-center justify-center flex flex-col">
				<AddTimerDialog btnLabel="" {subjectsData} {date} />
			</Card.Content>
		</Card.Root>
	</div>
{:else}
	<Empty {subjectsData} {date} />
{/if}
