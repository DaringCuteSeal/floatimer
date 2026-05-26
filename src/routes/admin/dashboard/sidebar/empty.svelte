<script lang="ts">
	import * as Empty from "$lib/components/ui/empty/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
	import Timer from "@lucide/svelte/icons/timer";
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
		<div class="flex gap-2">
			<Button>Buat Timer</Button>
		</div>
	</Empty.Content>
	<Button variant="link" class="text-muted-foreground" size="sm">
		<a href="#/">
			Pelajari lebih lanjut<ArrowUpRightIcon class="inline" />
		</a>
	</Button>
</Empty.Root>
