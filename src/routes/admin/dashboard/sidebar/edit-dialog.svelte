<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input";
	import Label from "$lib/components/ui/label/label.svelte";
	import SquarePen from "@lucide/svelte/icons/square-pen";

	let { subjectId, subjectName } = $props();
	let editDialogOpen = $state(false);
</script>

<Dialog.Root bind:open={editDialogOpen}>
	<Dialog.Trigger
		type="button"
		class={buttonVariants({
			variant: "outline",
		})}
	>
		<SquarePen />
		Sunting
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			method="post"
			action="?/renameSubject"
			class="contents"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === "success") {
						editDialogOpen = false;
					}
					await update();
				};
			}}
		>
			<Dialog.Header>
				<Dialog.Title>Sunting</Dialog.Title>
				<Dialog.Description>
					Ubah informasi mata pelajaran.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4">
				<div class="grid gap-3">
					<Label for="new-name">Nama</Label>
					<Input
						id="new-name"
						name="new_name"
						defaultValue={subjectName}
						required
					/>
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close
					type="button"
					class={buttonVariants({
						variant: "outline",
					})}
				>
					Cancel
				</Dialog.Close>
				<input type="hidden" name="id" value={subjectId} />
				<Button type="submit">Simpan Perubahan</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
