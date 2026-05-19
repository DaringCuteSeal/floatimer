<script lang="ts">
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import NavUser from "./sidebar/nav-user.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import type { PageServerData } from "./$types";
	import { getLocalTimeZone, today } from "@internationalized/date";
	import logo from "$lib/assets/timer.png";

	let {
		data,
	}: {
		data: PageServerData;
		children: import("svelte").Snippet;
	} = $props();

	const userData = {
		name: data.user.name,
		email: data.user.email,
		avatar: logo,
	};

	let calValue = $state(today(getLocalTimeZone()));
</script>

<ModeWatcher />

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Header class="border-sidebar-border h-16 border-b">
			<NavUser user={userData} />
		</Sidebar.Header>

		<Sidebar.Content>
			<Sidebar.Group class="px-0">
				<Sidebar.GroupContent>
					<Calendar
						bind:value={calValue}
						captionLayout="dropdown"
						type="single"
						class="[&_[role=gridcell]_[role=button][data-today]]:bg-sidebar-primary [&_[role=gridcell]_[role=button][data-today]]:text-sidebar-primary-foreground select-none [&_[data-bits-calendar-head-cell]]:w-[33px] [&_[role=gridcell]]:w-[33px]"
					/>
				</Sidebar.GroupContent>
			</Sidebar.Group>

			<Sidebar.Separator class="mx-0" />
		</Sidebar.Content>

		<Sidebar.Footer>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						<PlusIcon />
						<span>Tambah Mata Pelajaran</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>

	<main>
		<Sidebar.Trigger />
	</main>
</Sidebar.Provider>
