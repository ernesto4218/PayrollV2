<script lang="ts">
	import {
		Lock,
		Eye,
		EyeOff,
		ArrowRight,
		Building2,
		Users,
		CreditCard,
		FileText,
		ShieldCheck
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import { env } from '$env/dynamic/public';

	import { toast } from 'svelte-sonner';

	let { form }: { form: ActionData } = $props();

	let employeeId = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let remember = $state(false);
	let loading = $state(false);
</script>

<div class="flex min-h-screen font-['DM_Sans',sans-serif]">
	<!-- ═══ Left Brand Panel ═══ -->
	<aside
		class="relative hidden w-[46%] flex-col items-center justify-center overflow-hidden bg-[#1b4332] px-14 py-16 lg:flex"
	>
		<!-- Diagonal texture -->
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.04]"
			style="background-image: repeating-linear-gradient(-55deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 28px);"
		></div>

		<!-- Mint top accent -->
		<div
			class="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-transparent via-[#74c69d] to-transparent"
		></div>

		<!-- Ambient blobs -->
		<div
			class="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#52b788]/10 blur-3xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#081c15]/40 blur-3xl"
		></div>

		<!-- Decorative rings -->
		<div
			class="pointer-events-none absolute top-12 right-12 h-48 w-48 rounded-full border border-[#74c69d]/10"
		></div>
		<div
			class="pointer-events-none absolute bottom-20 left-8 h-32 w-32 rounded-full border border-[#74c69d]/[0.08]"
		></div>
		<div
			class="pointer-events-none absolute top-1/2 right-8 h-72 w-72 -translate-y-1/2 rounded-full border border-white/[0.04]"
		></div>

		<!-- Content -->
		<div class="relative z-10 flex w-full max-w-sm flex-col gap-10">
			<!-- Logo -->
			<div class="flex items-center gap-4">
				<div class="relative h-14 w-14 shrink-0">
					<div class="absolute inset-0 rounded-full bg-[#52b788]/20 ring-1 ring-[#74c69d]/30"></div>
					<div
						class="absolute inset-[3px] flex items-center justify-center rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] shadow-inner"
					>
						<Building2 size={22} class="text-[#74c69d]" />
					</div>
				</div>
				<div>
					<div
						class="font-['Playfair_Display',serif] text-[20px] leading-tight font-black text-white"
					>
						{env.PUBLIC_SHORT_NAME}
					</div>
					<div class="mt-1 flex items-center gap-1.5">
						<div class="h-px w-3 bg-[#74c69d]"></div>
						<span
							class="text-[8.5px] leading-tight font-bold tracking-[0.13em] text-white/30 uppercase"
						>
							{env.PUBLIC_NAME}
						</span>
					</div>
				</div>
			</div>

			<!-- Headline -->
			<div>
				<p class="mb-2 text-[10px] font-bold tracking-[0.18em] text-[#74c69d]/60 uppercase">
					{env.PUBLIC_SHORT_SYSTEM_NAME} · {env.PUBLIC_DOMAIN}
				</p>
				<h2
					class="font-['Playfair_Display',serif] text-[2.6rem] leading-[1.1] font-black text-white"
				>
					Payroll made<br />
					<span class="text-[#74c69d]">simple & secure.</span>
				</h2>
				<div class="my-5 flex items-center gap-3">
					<div class="h-px w-8 bg-[#74c69d]"></div>
					<div class="h-px flex-1 bg-white/10"></div>
				</div>
				<p class="text-[13.5px] leading-[1.85] text-white">
					Access payslips, compensation records, leave credits, and deductions — one secure portal
					for all {env.PUBLIC_SHORT_NAME} personnel.
				</p>
			</div>

			<!-- Trust badge -->
			<div
				class="flex items-start gap-3 rounded-xl bg-[#081c15]/25 px-4 py-3.5 ring-1 ring-[#74c69d]/10"
			>
				<ShieldCheck size={15} class="mt-0.5 shrink-0 text-[#74c69d]/50" />
				<p class="text-[11.5px] leading-relaxed text-white/60">
					This system is exclusively for authorized {env.PUBLIC_NAME} personnel. Unauthorized access is
					prohibited.
				</p>
			</div>
		</div>

		<!-- Bottom accent -->
		<div
			class="absolute right-0 bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#52b788]/30 to-transparent"
		></div>
	</aside>

	<!-- ═══ Right Form Panel ═══ -->
	<main
		class="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f4f7f5] px-6 py-16 sm:px-12"
	>
		<!-- Background blobs -->
		<div
			class="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#2d6a4f]/[0.05] blur-3xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#52b788]/[0.06] blur-3xl"
		></div>

		<!-- Dot grid -->
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.025]"
			style="background-image: radial-gradient(circle, #1b4332 1.5px, transparent 1.5px); background-size: 24px 24px;"
		></div>

		<div class="relative w-full max-w-96">
			<!-- Mobile logo -->
			<div class="mb-10 flex items-center gap-3 lg:hidden">
				<div class="relative h-10 w-10 shrink-0">
					<div class="absolute inset-0 rounded-full bg-[#52b788]/20 ring-1 ring-[#52b788]/30"></div>
					<div
						class="absolute inset-[2px] flex items-center justify-center rounded-full bg-[#1b4332]"
					>
						<Building2 size={16} class="text-[#74c69d]" />
					</div>
				</div>
				<div>
					<span class="font-['Playfair_Display',serif] text-lg font-black text-[#1b4332]">
						{env.PUBLIC_SHORT_NAME}
					</span>
					<p class="text-[9px] font-bold tracking-widest text-[#2d6a4f]/50 uppercase">
						{env.PUBLIC_SYSTEM_NAME}
					</p>
				</div>
			</div>

			<!-- Header -->
			<div class="mb-9">
				<div class="mb-3 flex items-center gap-3">
					<div class="h-px w-6 bg-[#52b788]"></div>
					<span class="text-[10px] font-black tracking-[0.16em] text-[#2d6a4f]/40 uppercase">
						{env.PUBLIC_SYSTEM_NAME}
					</span>
				</div>
				<h1
					class="font-['Playfair_Display',serif] text-[2rem] leading-tight font-black text-[#1b4332]"
				>
					Welcome back
				</h1>
				<p class="mt-2 text-[13.5px] text-[#2d6a4f]/50">
					Sign in with your {env.PUBLIC_SHORT_NAME} employee credentials.
				</p>
			</div>

			<!-- Error -->
			{#if form?.error}
				<p class="mb-5 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-500 ring-1 ring-red-100">
					{form.error}
				</p>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
				class="flex flex-col gap-4"
			>
				<!-- Employee ID -->
				<div class="flex flex-col gap-1.5">
					<label
						for="employeeId"
						class="text-[11.5px] font-bold tracking-wider text-[#2d6a4f]/60 uppercase"
					>
						Employee ID
					</label>
					<div class="relative flex items-center">
						<span class="pointer-events-none absolute left-3.5 text-[#2d6a4f]/35">
							<Users size={15} strokeWidth={1.8} />
						</span>
						<input
							id="employeeId"
							type="text"
							name="employeeId"
							bind:value={employeeId}
							placeholder="e.g. EMP-2024-0001"
							required
							class="w-full rounded-xl border border-[#2d6a4f]/12 bg-white py-3 pr-4 pl-10 text-[14px] text-[#1b4332] placeholder-[#2d6a4f]/25 transition outline-none focus:border-[#40916c]/40 focus:bg-white focus:ring-2 focus:ring-[#52b788]/15"
						/>
					</div>
				</div>

				<!-- Password -->
				<div class="flex flex-col gap-1.5">
					<div class="flex items-center justify-between">
						<label
							for="password"
							class="text-[11.5px] font-bold tracking-wider text-[#2d6a4f]/60 uppercase"
						>
							Password
						</label>
						<a
							href="/forgot-password"
							class="text-[12px] font-medium text-[#40916c]/50 transition hover:text-[#2d6a4f]"
						>
							Forgot password?
						</a>
					</div>
					<div class="relative flex items-center">
						<span class="pointer-events-none absolute left-3.5 text-[#2d6a4f]/35">
							<Lock size={15} strokeWidth={1.8} />
						</span>
						<input
							id="password"
							name="password"
							bind:value={password}
							type={showPassword ? 'text' : 'password'}
							placeholder="••••••••"
							required
							class="w-full rounded-xl border border-[#2d6a4f]/12 bg-white py-3 pr-11 pl-10 text-[14px] text-[#1b4332] placeholder-[#2d6a4f]/25 transition outline-none focus:border-[#40916c]/40 focus:ring-2 focus:ring-[#52b788]/15"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute right-3.5 p-1 text-[#2d6a4f]/35 transition hover:text-[#1b4332]"
							aria-label="Toggle password visibility"
						>
							{#if showPassword}
								<EyeOff size={14} strokeWidth={1.8} />
							{:else}
								<Eye size={14} strokeWidth={1.8} />
							{/if}
						</button>
					</div>
				</div>

				<!-- Remember me -->
				<label class="flex cursor-pointer items-center gap-2.5 select-none">
					<input
						type="checkbox"
						bind:checked={remember}
						class="h-4 w-4 cursor-pointer rounded border-[#2d6a4f]/20 bg-white accent-[#2d6a4f]"
					/>
					<span class="text-[13px] text-[#2d6a4f]/45">Keep me signed in on this device</span>
				</label>

				<!-- Submit -->
				<button
					type="submit"
					disabled={loading}
					class="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] py-3.5 text-[14px] font-bold text-white shadow-lg shadow-[#1b4332]/20 transition-all outline-none
						{loading
						? 'cursor-not-allowed opacity-60'
						: 'hover:-translate-y-0.5 hover:bg-[#40916c] hover:shadow-[#1b4332]/30 active:translate-y-0 active:scale-[0.99]'}"
				>
					{#if loading}
						<span class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"
						></span>
						Signing in…
					{:else}
						Sign In
						<ArrowRight
							size={15}
							strokeWidth={2.2}
							class="transition-transform group-hover:translate-x-1"
						/>
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="my-7 flex items-center gap-3">
				<div class="h-px flex-1 bg-[#2d6a4f]/8"></div>
				<span class="text-[11px] font-medium text-[#2d6a4f]/25">Need help?</span>
				<div class="h-px flex-1 bg-[#2d6a4f]/8"></div>
			</div>

			<!-- Help -->
			<p class="text-center text-[13px] text-[#2d6a4f]/40">
				Contact the
				<a
					href="/support"
					class="font-bold text-[#2d6a4f] underline-offset-2 transition hover:text-[#40916c] hover:underline"
				>
					HR / Payroll Office
				</a>
				for access issues.
			</p>

			<!-- Bottom bar -->
			<div
				class="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#2d6a4f]/10 pt-5"
			>
				<span class="text-[11px] text-[#2d6a4f]/30">© 2026 {env.PUBLIC_NAME}</span>
				<div class="flex gap-4">
					<a href="/privacy" class="text-[11px] text-[#2d6a4f]/30 transition hover:text-[#2d6a4f]"
						>Privacy Policy</a
					>
					<a href="/terms" class="text-[11px] text-[#2d6a4f]/30 transition hover:text-[#2d6a4f]"
						>Terms of Use</a
					>
				</div>
			</div>
		</div>
	</main>
</div>
