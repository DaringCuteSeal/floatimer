<script lang="ts">
	import * as Empty from "$lib/components/ui/empty/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
	import Timer from "@lucide/svelte/icons/timer";
	import AddTimerCard from "./add-timer-card.svelte";
	import type { InferSelectModel } from "drizzle-orm";
	import type { subjects } from "$lib/server/db/subjects.schema";

	let {
		subjectsData,
		date,
	}: { subjectsData: Array<InferSelectModel<typeof subjects>>; date: Date } =
		$props();
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media>
			<Timer />
		</Empty.Media>
		<Empty.Title>Belum Ada Timer</Empty.Title>
		<Empty.Description>
			Belum ada timer ujian untuk hari ini.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<AddTimerCard {subjectsData} {date} formAction="?/addTimer" />
	</Empty.Content>
	<Button variant="link" class="text-muted-foreground" size="sm">
		<a href="https://github.com/Daringcuteseal/floatimer">
			Pelajari lebih lanjut<ArrowUpRightIcon class="inline" />
		</a>
	</Button>
</Empty.Root>
