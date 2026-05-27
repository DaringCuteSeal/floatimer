<script lang="ts">
	import { enhance } from "$app/forms";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { buttonVariants } from "$lib/components/ui/button";
	import Trash2 from "@lucide/svelte/icons/trash-2";

	let { subjectId, subjectName } = $props();
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger
		class={buttonVariants({
			variant: "destructive",
		})}
	>
		<Trash2 />Hapus
	</AlertDialog.Trigger>

	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Benar-benar Yakin?</AlertDialog.Title>
			<AlertDialog.Description>
				Yakin untuk menghapus mata pelajaran "{subjectName}"? <br /> Aksi
				ini akan turut menghapus semua timer dengan mata pelajaran {subjectName}.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
			<form
				method="post"
				action="?/deleteSubject"
				class="contents"
				use:enhance
			>
				<input type="hidden" name="id" value={subjectId} />
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
