<script lang="ts">
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import { Button } from "$lib/components/ui/button";
	import { page } from "$app/state";
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

<div class="text-xl flex flex-col items-center h-full justify-center h-screen">
	<h1>Ups!</h1>
	<p>Terjadi kesalahan: {page.error?.message}</p>
</div>
