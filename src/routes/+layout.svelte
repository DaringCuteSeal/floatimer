<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.png";
	let { children } = $props();
</script>

<svelte:head
	><link rel="icon" href={favicon} /> <title>Floatimer</title></svelte:head
>

{@render children?.()}
