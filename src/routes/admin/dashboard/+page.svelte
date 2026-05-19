<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageServerData } from "./$types";

	let { children } = $props();
</script>

{@render children?.()}
