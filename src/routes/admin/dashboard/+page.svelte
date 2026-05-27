<script lang="ts">
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import NavUser from "./sidebar/nav-user.svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import Settings from "@lucide/svelte/icons/settings";
	import Search from "@lucide/svelte/icons/search";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import CircleSmall from "@lucide/svelte/icons/circle-small";
	import Plus from "@lucide/svelte/icons/plus";
	import Info from "@lucide/svelte/icons/info";
	import { goto, invalidateAll } from "$app/navigation";
	import * as Table from "$lib/components/ui/table/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import type { PageServerData } from "./$types";
	import {
		CalendarDate,
		fromDate,
		toCalendarDate,
		today,
	} from "@internationalized/date";
	import logo from "$lib/assets/timer.png";
	import { buttonVariants } from "$lib/components/ui/button";

	import { enhance } from "$app/forms";
	import SubjectEditDialog from "./sidebar/subject-edit-dialog.svelte";
	import SubjectDeleteDialog from "./sidebar/subject-delete-dialog.svelte";
	import Editor from "./sidebar/editor.svelte";
	import { Separator } from "$lib/components/ui/separator";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import { public_cfg } from "$lib/public_cfg";
	import { dateFormatMachine, dateValueFormatMachine } from "$lib/utils";
	import CalendarDay from "$lib/components/ui/calendar/calendar-day.svelte";

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

	const dateFormatter = Intl.DateTimeFormat("id-ID", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	let calValue: CalendarDate = $state(
		toCalendarDate(fromDate(data.date, public_cfg.TIMEZONE)),
	);
	const thisDay = toCalendarDate(fromDate(data.thisDay, public_cfg.TIMEZONE));

	let subjectFilterValue = $state("");

	$effect(() => {
		goto(`?date=${dateFormatMachine(calValue.toDate(public_cfg.TIMEZONE))}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
		});
	});
</script>

<ModeWatcher />

<Sidebar.Provider style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem">
	<Sidebar.Root>
		<Sidebar.Header class="border-sidebar-border h-16 border-b">
			<NavUser user={userData} />
		</Sidebar.Header>

		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Card.Root>
						<Card.Header>
							<Card.Title>Tanggal</Card.Title>
							<Card.Description>Pilih tanggal.</Card.Description>
							<Card.Action>
								<Button
									size="sm"
									variant="outline"
									onclick={() =>
										(calValue = today(public_cfg.TIMEZONE))}
								>
									Hari ini
								</Button>
							</Card.Action>
						</Card.Header>
						<Card.Content>
							<Calendar
								locale="id-ID"
								captionLayout="dropdown"
								value={calValue}
								type="single"
								class="w-full rounded-md [&_table]:w-full [&_td]:w-full [&_th]:w-full"
								onValueChange={(newDate) => {
									if (!newDate) {
										return;
									}
									calValue = toCalendarDate(newDate);
								}}
								minValue={thisDay}
							>
								{#snippet day({ day })}
									{@const existsDate = data.dateWithTimers.has(
										dateValueFormatMachine(day),
									)}
									<CalendarDay class="flex flex-col items-center">
										{day.day}
										{#if existsDate && day.compare(thisDay) >= 0}
											<span>
												<CircleSmall fill="white" size={10} />
											</span>
										{/if}
									</CalendarDay>
								{/snippet}
							</Calendar>
						</Card.Content>
					</Card.Root>
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

								<div class="p-4 flex flex-row gap-3">
									<InputGroup.Root>
										<InputGroup.Input
											bind:value={subjectFilterValue}
											name="filter"
											placeholder="Cari..."
										/>
										<InputGroup.Addon>
											<Search />
										</InputGroup.Addon>
									</InputGroup.Root>
								</div>

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
											<Button type="submit"><Plus />Tambah</Button>
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
										<ScrollArea class="h-80 rounded-md border">
											{#each data.subjects as subject (subject.id)}
												{#if subject.name
													.toLowerCase()
													.includes(subjectFilterValue.toLowerCase())}
													<div
														class="flex items-center justify-between rounded-md border p-2"
													>
														<span class="text-sm"
															>{subject.name}</span
														>

														<div class="flex gap-2">
															<SubjectEditDialog
																subjectId={subject.id}
																subjectName={subject.name}
															/>
															<SubjectDeleteDialog
																subjectId={subject.id}
																subjectName={subject.name}
															/>
														</div>
													</div>
												{/if}
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
						<Breadcrumb.Page
							>{dateFormatter.format(
								calValue.toDate(public_cfg.TIMEZONE),
							)}</Breadcrumb.Page
						>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div class="ms-auto flex items-center gap-2">
				<Button onclick={toggleMode} variant="outline" size="icon">
					<SunIcon
						class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
					/>
					<MoonIcon
						class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>

				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: "outline" })}
						><Info /> Server</Dialog.Trigger
					>
					<Dialog.Content class="sm:max-w-md">
						<Dialog.Header>
							<Dialog.Title>Informasi Konfigurasi Server</Dialog.Title>
						</Dialog.Header>
						<Table.Root>
							<Table.Caption>
								Nilai konfigurasi di atas dapat diatur dengan mengedit <i
									>environment variable</i
								> pada server.
							</Table.Caption>
							<Table.Header>
								<Table.Row>
									<Table.Head class="w-[100px]">Konfigurasi</Table.Head
									>
									<Table.Head class="text-end">Nilai</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell>Zona waktu</Table.Cell>
									<Table.Cell class="text-end"
										>{public_cfg.TIMEZONE}</Table.Cell
									>
								</Table.Row>
							</Table.Body>
						</Table.Root>
						<Dialog.Footer class="sm:justify-end">
							<Dialog.Close
								class={buttonVariants({ variant: "secondary" })}
								>Tutup</Dialog.Close
							>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4">
			<!-- beware: date is set to data.date. this works because when the date is updated, the data is updated too. in case this behavior change, this might break. i'm just doing it this way so i don't need to convert calValue to a native Date object.  -->
			<Editor
				timersData={data.timers}
				subjectsData={data.subjects}
				date={data.date}
			/>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
