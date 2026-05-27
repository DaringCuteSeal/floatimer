<script lang="ts">
	import { enhance } from "$app/forms";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { cn } from "$lib/utils";
	import { buttonVariants } from "$lib/components/ui/button";
	import Trash2 from "@lucide/svelte/icons/trash-2";

	let {
		class: ClassName,
		timerId,
		timerName,
	}: { class?: string; timerId: number; timerName: string } = $props();
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger
		class={cn(
			ClassName,
			buttonVariants({
				variant: "destructive",
			}),
		)}
	>
		<Trash2 />Hapus
	</AlertDialog.Trigger>

	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Benar-benar Yakin?</AlertDialog.Title>
			<AlertDialog.Description>
				Yakin untuk menghapus timer {timerName == ""
					? "ini"
					: `"${timerName}"`}?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
			<form
				method="post"
				action="?/deleteTimer"
				class="contents"
				use:enhance
			>
				<input type="hidden" name="id" value={timerId} />
				<AlertDialog.Action
					class={buttonVariants({
						variant: "destructive",
					})}
				>
					Hapus
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
