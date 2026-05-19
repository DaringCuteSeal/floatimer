<script lang="ts">
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import NavUser from "./sidebar/nav-user.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import Settings from "@lucide/svelte/icons/settings";
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import type { PageServerData } from "./$types";
	import { getLocalTimeZone, today } from "@internationalized/date";
	import logo from "$lib/assets/timer.png";
	import { buttonVariants } from "$lib/components/ui/button";

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
						locale="id-ID"
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
					<Drawer.Root>
						<Drawer.Trigger class="w-full">
							<Sidebar.MenuButton>
								<Settings />
								<span>Mata Pelajaran</span>
							</Sidebar.MenuButton>
						</Drawer.Trigger>

						<Drawer.Content>
							<div class="mx-auto w-full max-w-sm">
								<Drawer.Header>
									<Drawer.Title>Move Goal</Drawer.Title>
									<Drawer.Description>
										Set your daily activity goal.
									</Drawer.Description>
								</Drawer.Header>

								<div class="p-4 pb-0">
									<div
										class="flex items-center justify-center space-x-2"
									>
										<Button
											variant="outline"
											size="icon"
											class="size-8 shrink-0 rounded-full"
										>
											<span class="sr-only">Decrease</span>
										</Button>

										<div class="flex-1 text-center">
											<div
												class="text-7xl font-bold tracking-tighter"
											>
												100
											</div>
											<div
												class="text-muted-foreground text-[0.70rem] uppercase"
											>
												Calories/day
											</div>
										</div>

										<Button
											variant="outline"
											size="icon"
											class="size-8 shrink-0 rounded-full"
										>
											<Settings />
											<span class="sr-only">Increase</span>
										</Button>
									</div>
								</div>

								<Drawer.Footer>
									<Button>Submit</Button>
									<Drawer.Close
										class={buttonVariants({ variant: "outline" })}
									>
										Cancel
									</Drawer.Close>
								</Drawer.Footer>
							</div>
						</Drawer.Content>
					</Drawer.Root>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>

		<Sidebar.Rail />
	</Sidebar.Root>

	<main>
		<Sidebar.Trigger />
		<form method="post" action="?/signOut">
			<button
				class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
				>Sign out</button
			>
		</form>
	</main>
</Sidebar.Provider>
