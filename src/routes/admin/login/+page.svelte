<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import Watermark from "$lib/components/ui/watermark/watermark.svelte";
	import type { ActionData } from "./$types";
	import { enhance } from "$app/forms";
	let { form }: { form: ActionData } = $props();
	import Zap from "@lucide/svelte/icons/zap";
</script>

<div class="bg">
	<div class="min-h-screen flex flex-col">
		<form
			method="post"
			action="?/signInEmail"
			use:enhance
			class="flex-1 flex items-center justify-center p-8"
		>
			<Card.Root class="-my-4 w-full max-w-sm">
				<Card.Header>
					<Card.Title>Login ke Dashboard</Card.Title>
					<Card.Description
						>Masukkan kredensialmu untuk mengakses dashboard.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Field.Set>
						<Field.Field>
							<Field.Label for="email">Email</Field.Label>
							<Input
								name="email"
								type="email"
								id="email"
								placeholder="nama@mail.com"
								required
							/>
							<Field.Description
								>Email akun administrator.</Field.Description
							>
						</Field.Field>
						<Field.Field>
							<Field.Label for="password">Sandi</Field.Label>
							<Input
								name="password"
								type="password"
								id="password"
								autocomplete="off"
								required
							/>

							<Field.Description>Kata sandi.</Field.Description>
						</Field.Field>
					</Field.Set>
				</Card.Content>
				<Card.Footer class="flex-col gap-2">
					<Field.Error>{form?.message ?? ""}</Field.Error>
					<Button type="submit" class="w-full">Login</Button>
				</Card.Footer>
			</Card.Root>
		</form>

		<Watermark />
	</div>
</div>

<style>
	.bg {
		background-image: url("$lib/assets/drops.png");
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
		background-position: center;
	}
</style>
