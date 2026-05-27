<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import Label from "$lib/components/ui/label/label.svelte";
	import Clock from "@lucide/svelte/icons/clock";
	import ArrowRight from "@lucide/svelte/icons/arrow-right";
	import type { InferSelectModel } from "drizzle-orm";

	import { browser } from "$app/environment";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { onMount } from "svelte";
	import type { subjects } from "$lib/server/db/subjects.schema";

	let {
		subjectsData,
		date,
		defaultName,
		defaultStartTime,
		defaultSubject,
		defaultEndTime,
		timerId,
	}: {
		subjectsData: Array<InferSelectModel<typeof subjects>>;
		date: Date;
		defaultName?: string;
		defaultStartTime?: string;
		defaultSubject?: InferSelectModel<typeof subjects>;
		defaultEndTime?: string;
		timerId: number;
	} = $props();

	let subjectSelectionOpen = $state(false);
	let subjectSelectionError = $state(false);
	let selectedSubject: InferSelectModel<typeof subjects> | null = $state(
		defaultSubject ?? null,
	);
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

	let startTime = $state(defaultStartTime ?? "");
	let endTime = $state(defaultEndTime ?? "");

	let editDialogOpen = $state(false);

	// we do a magic svelte data reload but we don't reload the page, hence
	// after we submit the fields will become empty again. hence, we have to
	// reassign them with the original values we originally got.
	$effect(() => {
		if (!editDialogOpen) return;

		startTime = defaultStartTime ?? "";
		endTime = defaultEndTime ?? "";
		selectedSubject = defaultSubject ?? null;
	});
</script>

<Dialog.Root bind:open={editDialogOpen}>
	<Dialog.Trigger
		type="button"
		class={`w-full ${buttonVariants({ variant: "default" })}`}
	>
		Sunting
	</Dialog.Trigger>
	<Dialog.Content>
		<form
			method="post"
			action="?/editTimer"
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
					if (result.type === "success") {
						editDialogOpen = false;
					}
					await update();
				};
			}}
		>
			<Dialog.Header>
				<Dialog.Title>Sunting Timer</Dialog.Title>
				<Dialog.Description>Sunting timer ujian.</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4">
				<div class="grid gap-3">
					<Label for="new-name">Nama</Label>
					<Input id="new-name" name="name" value={defaultName} required />

					<div class="flex flex-row gap-3 items-center">
						<div class="w-full flex-col gap-2 flex">
							<Label for="time-start">Waktu Mulai</Label>
							<InputGroup.Root>
								<InputGroup.Input
									bind:value={startTime}
									id="time-start"
									type="time"
									name="time_start"
									required
								/>
								<InputGroup.Addon>
									<Clock />
								</InputGroup.Addon>
							</InputGroup.Root>
						</div>

						<div class="h-max">
							<ArrowRight />
						</div>

						<div class="w-full flex-col gap-2 flex">
							<Label for="time-end">Waktu Selesai</Label>
							<InputGroup.Root>
								<InputGroup.Input
									bind:value={endTime}
									min={startTime}
									id="time-end"
									type="time"
									name="time_end"
									required
								/>
								<InputGroup.Addon>
									<Clock />
								</InputGroup.Addon>
							</InputGroup.Root>
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

			<Dialog.Footer>
				<Dialog.Close
					type="button"
					class={buttonVariants({ variant: "outline" })}
				>
					Batal
				</Dialog.Close>
				{#if selectedSubject != null}
					<input
						type="hidden"
						name="subject_id"
						value={selectedSubject.id}
					/>
				{/if}
				<input type="hidden" name="id" value={String(timerId)} />
				<input type="hidden" name="date" value={date.toISOString()} />
				<Button type="submit">Simpan Perubahan</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
