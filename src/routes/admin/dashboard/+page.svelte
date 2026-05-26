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
	import Editor from "./sidebar/editor.svelte";
	import { Separator } from "$lib/components/ui/separator";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";

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
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Calendar
						locale="id-ID"
						bind:value={calValue}
						captionLayout="dropdown"
						type="single"
						class="w-full rounded-md border [&_table]:w-full [&_td]:w-full [&_th]:w-full"
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
										Tambah, sunting, atau hapus mata pelajaran.
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

	<Sidebar.Inset>
		<header
			class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4"
		>
			<Sidebar.Trigger class="-ms-1" />
			<Separator
				orientation="vertical"
				class="me-2 data-[orientation=vertical]:h-4"
			/>
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Page>October 2024</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4">
			<div class="grid auto-rows-min gap-4 md:grid-cols-5">
				{#each Array.from({ length: 20 }) as _, index (index)}
					<div class="bg-muted/50 aspect-square rounded-xl"></div>
				{/each}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
