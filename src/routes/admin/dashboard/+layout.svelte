<script lang="ts">
	import Calendars from "./sidebar/calendars.svelte";
	import DatePicker from "./sidebar/date-picker.svelte";
	import NavUser from "./sidebar/nav-user.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import type { ComponentProps } from "svelte";
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import type { PageServerData } from "./$types";
	import logo from "$lib/assets/timer.png";

	let {
		data,
		children,
	}: {
		data: PageServerData;
		children: import("svelte").Snippet;
	} = $props();

	const userData = {
		name: data.user.name,
		email: data.user.email,
		avatar: logo,
	};
</script>

<ModeWatcher />

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Header class="border-sidebar-border h-16 border-b">
			<NavUser user={userData} />
		</Sidebar.Header>
		<Sidebar.Content>
			<DatePicker />
			<Sidebar.Separator class="mx-0" />
		</Sidebar.Content>
		<Sidebar.Footer>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						<PlusIcon />
						<span>New Calendar</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>

	<main>
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
