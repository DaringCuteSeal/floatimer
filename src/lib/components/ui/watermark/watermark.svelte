<script lang="ts">
	import Zap from "@lucide/svelte/icons/zap";
	import type { Snippet } from "svelte";

	let { inner }: { inner?: Snippet<[]> } = $props();
</script>

<div class="flex justify-center pb-4">
	<p>
		Menggunakan
		<u><a href="https://github.com/Daringcuteseal/floatimer"> Floatimer</a></u
		>.
		<Zap class="inline" />
	</p>
	{#if inner}
		{@render inner()}
	{/if}
</div>
