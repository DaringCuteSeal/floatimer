<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input";
	import Label from "$lib/components/ui/label/label.svelte";
	import Plus from "@lucide/svelte/icons/plus";
	import ArrowRight from "@lucide/svelte/icons/arrow-right";
	import type { InferSelectModel } from "drizzle-orm";

	import { browser } from "$app/environment";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { onMount } from "svelte";
	import type { subjects } from "$lib/server/db/subjects.schema";

	let {
		subjectsData,
		date,
	}: {
		btnLabel: string;
		subjectsData: Array<InferSelectModel<typeof subjects>>;
		date: Date;
	} = $props();

	let subjectSelectionOpen = $state(false);
	let subjectSelectionError = $state(false);
	let selectedSubject: InferSelectModel<typeof subjects> | null = $state(null);
	let isDesktop = $state(false);

	function checkScreenSize() {
		isDesktop = window.innerWidth >= 768;
	}

	onMount(() => {
		if (browser) {
			checkScreenSize();
			window.addEventListener("resize", checkScreenSize);
			return () => window.removeEventListener("resize", checkScreenSize);
		}
	});

	function handleSubjectSelect(value: string) {
		selectedSubject =
			subjectsData.find((subject) => subject.name === value) || null;
		subjectSelectionError = false;
		subjectSelectionOpen = false;
	}

	$effect(() => {
		// when the subjectsData gets updated (user deletes subject) it might disappear already.
		if (selectedSubject == null) {
			return;
		}
		if (!subjectsData.some((v) => v.id == selectedSubject?.id)) {
			selectedSubject = null;
		}
	});
</script>

<Card.Root>
	<form
		method="post"
		action="?/addTimer"
		class="contents"
		use:enhance={() => {
			// prevent submission if subject hasn't been chosen yet.
			// gotta be handled manually as the input is just a button that doesn't contain any value.
			// (the real value is under our hidden input with value of selectedSubject.id)
			if (selectedSubject == null) {
				subjectSelectionError = true;
				return async () => {};
			}
			return async ({ result, update }) => {
				selectedSubject = null; // TODO: unelegant hm
				await update();
			};
		}}
	>
		<Card.Header>
			<Card.Title>Tambah Timer</Card.Title>
			<Card.Description>Tambahkan timer ujian.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-3">
					<Label for="new-name">Nama</Label>
					<Input id="new-name" name="name" required />

					<div class="flex flex-row gap-3 items-center">
						<div class="w-full flex-col gap-2 flex">
							<Label for="time-start">Waktu Mulai</Label>
							<Input
								id="time-start"
								type="time"
								name="time_start"
								required
							/>
						</div>

						<div class="h-max">
							<ArrowRight />
						</div>

						<div class="w-full flex-col gap-2 flex">
							<Label for="time-end">Waktu Selesai</Label>
							<Input
								id="time-end"
								type="time"
								name="time_end"
								required
							/>
						</div>
					</div>

					<Label for="subject">Mata Pelajaran</Label>
					{#if isDesktop}
						<Popover.Root bind:open={subjectSelectionOpen}>
							<Popover.Trigger>
								<Button
									variant="outline"
									class="w-full justify-start"
									id="subject"
									aria-invalid={subjectSelectionError}
								>
									{selectedSubject
										? selectedSubject.name
										: "Pilih mata pelajaran..."}
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-[200px] p-0" align="start">
								<Command.Root>
									<Command.Input
										placeholder="Cari mata pelajaran..."
									/>
									<Command.List>
										<Command.Empty>No results found.</Command.Empty>
										<Command.Group>
											{#each subjectsData as subject (subject.id)}
												<Command.Item
													value={subject.name}
													onSelect={() =>
														handleSubjectSelect(subject.name)}
												>
													{subject.name}
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.List>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					{:else}
						<Drawer.Root bind:open={subjectSelectionOpen}>
							<Drawer.Trigger>
								<Button
									variant="outline"
									class="w-full justify-start"
									aria-invalid={subjectSelectionError}
								>
									{selectedSubject
										? selectedSubject.name
										: "Pilih mata pelajaran..."}
								</Button>
							</Drawer.Trigger>
							<Drawer.Content>
								<div class="mt-4 border-t">
									<Command.Root>
										<Command.Input
											placeholder="Cari mata pelajaran..."
										/>
										<Command.List>
											<Command.Empty>No results found.</Command.Empty
											>
											<Command.Group>
												{#each subjectsData as subject (subject.id)}
													<Command.Item
														value={subject.name}
														onSelect={() =>
															handleSubjectSelect(subject.name)}
													>
														{subject.name}
													</Command.Item>
												{/each}
											</Command.Group>
										</Command.List>
									</Command.Root>
								</div>
							</Drawer.Content>
						</Drawer.Root>
					{/if}
				</div>
			</div>
		</Card.Content>
		<Card.Footer>
			{#if selectedSubject != null}
				<input type="hidden" name="subject_id" value={selectedSubject.id} />
				<input type="hidden" name="date" value={date.toISOString()} />
			{/if}
			<Button type="submit">Buat Timer</Button>
		</Card.Footer>
	</form>
</Card.Root>
