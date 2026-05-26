<script lang="ts">
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import NavUser from "./sidebar/nav-user.svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import Settings from "@lucide/svelte/icons/settings";
	import { invalidateAll } from "$app/navigation";
	import { Input } from "$lib/components/ui/input/index.js";
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import type { PageServerData } from "./$types";
	import { getLocalTimeZone, today } from "@internationalized/date";
	import logo from "$lib/assets/timer.png";
	import { buttonVariants } from "$lib/components/ui/button";

	import { enhance } from "$app/forms";
	import EditDialog from "./sidebar/edit-dialog.svelte";
	import DeleteDialog from "./sidebar/delete-dialog.svelte";

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

	// tambahin metadata is_editing
	// hehe as if it does anything when compiled
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
						class="[&_[role=gridcell]_[role=button][data-today]]:bg-sidebar-primary [&_[role=gridcell]_[role=button][data-today]]:text-sidebar-primary-foreground select-none [&_[data-bits-calendar-head-cell]]:w-full [&_[role=gridcell]]:w-full"
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
							<div class="mx-auto w-full max-w-md">
								<Drawer.Header>
									<Drawer.Title>Mata Pelajaran</Drawer.Title>
									<Drawer.Description>
										Tambah, edit, atau hapus mata pelajaran.
									</Drawer.Description>
								</Drawer.Header>

								<div class="p-4 space-y-2">
									<div class="flex gap-2">
										<form
											method="post"
											action="?/addSubject"
											use:enhance
											class="flex-1 flex flex-row gap-3"
										>
											<Input
												name="name"
												placeholder="Nama mata pelajaran baru..."
												required
											/>
											<Button type="submit">Tambah</Button>
										</form>
									</div>
								</div>

								<div class="px-4 pb-4 space-y-2">
									{#if data.subjects.length === 0}
										<div
											class="text-sm text-muted-foreground text-center py-6"
										>
											Belum ada mata pelajaran. Tambah satu?
										</div>
									{:else}
										<ScrollArea class="h-72 rounded-md border">
											{#each data.subjects as subject (subject.id)}
												<div
													class="flex items-center justify-between rounded-md border p-2"
												>
													<span class="text-sm"
														>{subject.name}</span
													>

													<div class="flex gap-2">
														<EditDialog
															subjectId={subject.id}
															subjectName={subject.name}
														/>
														<DeleteDialog
															subjectId={subject.id}
															subjectName={subject.name}
														/>
													</div>
												</div>
											{/each}
										</ScrollArea>
									{/if}
								</div>

								<Drawer.Footer>
									<Drawer.Close
										class={buttonVariants({ variant: "outline" })}
									>
										Selesai
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
	</main>
</Sidebar.Provider>
