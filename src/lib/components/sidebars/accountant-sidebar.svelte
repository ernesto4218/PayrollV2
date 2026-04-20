<script lang="ts">
	import { page } from '$app/stores';

	import {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarGroupLabel,
		SidebarGroupContent,
		SidebarMenu,
		SidebarMenuItem,
		SidebarMenuButton,
		SidebarHeader,
		SidebarFooter
	} from '$lib/components/ui/sidebar';

	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger
	} from '$lib/components/ui/collapsible';

	import {
		Calculator,
		LayoutDashboard,
		Users,
		Clock,
		TrendingUp,
		TrendingDown,
		Wallet,
		Gift,
		CalendarOff,
		FileText,
		ChevronRight,
		LogOut,
		CircleUserRound,
		FileBarChart,
		Van,
		BookOpen,
		BookCheck,
		Settings
	} from 'lucide-svelte';
	import { env } from '$env/dynamic/public';

	const { data } = $props<{
		data: {
			user: { first_name: string; middle_name: string; last_name: string; role: string } | null;
		};
	}>();

	let isPayrollOpen = $state(true);
	let isReportsOpen = $state(false);
	let isParttimeOpen = $state(true);
	let isSettingsOpen = $state(false);

	const mainNav = [
		{ title: 'Dashboard', url: '/accountant/dashboard', icon: LayoutDashboard },
		{ title: 'Employees', url: '/accountant/employees', icon: Users },
		{ title: 'Undertime', url: '/accountant/undertime', icon: TrendingDown },
		{ title: 'Deductions', url: '/accountant/deductions', icon: Wallet },
		{ title: 'C.A/Travel Order', url: '/accountant/travel-order', icon: Van }
	];

	const parttimeNav = [
		{ title: 'Hours Rendered', url: '/accountant/hours-rendered', icon: Clock },
		{ title: 'Faculty Load', url: '/accountant/faculty-load', icon: BookCheck },
		{ title: 'Subjects', url: '/accountant/subjects', icon: BookOpen }
	];

	const payrollNav = [
		{ title: 'Overview', url: '/accountant/payroll' },
		{ title: 'Run Payroll', url: '/accountant/payroll/run' }
	];

	const reportsNav = [
		{ title: 'Payslip', url: '/accountant/reports/payslip' },
		{ title: 'Summary', url: '/accountant/reports/summary' }
	];

	const settingsNav = [{ title: 'Calculations', url: '/accountant/calculations', icon: Settings }];

	const userInitials =
		data?.user?.name
			?.split(' ')
			.map((n: any[]) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) ?? 'AC';
</script>

<Sidebar>
	<!-- Header -->
	<SidebarHeader class="bg-white">
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" class="cursor-default hover:bg-transparent">
					<div
						class="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white"
					>
						<Calculator class="h-4 w-4" />
					</div>
					<div class="flex flex-col gap-0.5 leading-none">
						<span class="font-semibold">{env.PUBLIC_SHORT_SYSTEM_NAME}</span>
						<span class="text-xs text-muted-foreground">{env.PUBLIC_SYSTEM_NAME}</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>

	<!-- Content -->
	<SidebarContent class="flex flex-col gap-0 bg-white">
		<!-- Main Nav -->
		<SidebarGroup>
			<SidebarMenu>
				{#each mainNav as item}
					{@const isActive = $page.url.pathname === item.url}
					<SidebarMenuItem>
						<SidebarMenuButton {isActive}>
							{#snippet child({ props })}
								<a href={item.url} {...props}>
									<svelte:component this={item.icon} />
									<span class="text-xs">{item.title}</span>
								</a>
							{/snippet}
						</SidebarMenuButton>
					</SidebarMenuItem>
				{/each}
			</SidebarMenu>
		</SidebarGroup>

		<!-- Parttime Collapsible -->
		<Collapsible bind:open={isParttimeOpen} class="group/collapsible">
			<SidebarGroup>
				<CollapsibleTrigger>
					{#snippet child({ props })}
						<SidebarGroupLabel
							{...props}
							class="flex w-full cursor-pointer items-center justify-between hover:bg-sidebar-accent"
						>
							<span>Part-time</span>
							<ChevronRight
								class="h-4 w-4 transition-transform {isParttimeOpen ? 'rotate-90' : ''}"
							/>
						</SidebarGroupLabel>
					{/snippet}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{#each parttimeNav as item}
								<SidebarMenuItem>
									<SidebarMenuButton isActive={$page.url.pathname === item.url}>
										{#snippet child({ props })}
											<a href={item.url} {...props}>
												<item.icon class="h-4 w-4" />
												<span class="text-xs">{item.title}</span>
											</a>
										{/snippet}
									</SidebarMenuButton>
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>

		<!-- Payroll Collapsible -->
		<Collapsible bind:open={isPayrollOpen} class="group/collapsible">
			<SidebarGroup>
				<CollapsibleTrigger>
					{#snippet child({ props })}
						<SidebarGroupLabel
							{...props}
							class="flex w-full cursor-pointer items-center justify-between hover:bg-sidebar-accent"
						>
							<span>Payroll</span>
							<ChevronRight
								class="h-4 w-4 transition-transform {isPayrollOpen ? 'rotate-90' : ''}"
							/>
						</SidebarGroupLabel>
					{/snippet}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{#each payrollNav as item}
								<SidebarMenuItem>
									<SidebarMenuButton isActive={$page.url.pathname === item.url}>
										{#snippet child({ props })}
											<a href={item.url} {...props}>
												<FileText class="h-4 w-4" />
												<span class="text-xs">{item.title}</span>
											</a>
										{/snippet}
									</SidebarMenuButton>
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>

		<!-- Reports Collapsible -->
		<Collapsible bind:open={isReportsOpen} class="group/collapsible -mt-2">
			<SidebarGroup>
				<CollapsibleTrigger>
					{#snippet child({ props })}
						<SidebarGroupLabel
							{...props}
							class="flex w-full cursor-pointer items-center justify-between hover:bg-sidebar-accent"
						>
							<span>Reports</span>
							<ChevronRight
								class="h-4 w-4 transition-transform {isReportsOpen ? 'rotate-90' : ''}"
							/>
						</SidebarGroupLabel>
					{/snippet}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{#each reportsNav as item}
								<SidebarMenuItem>
									<SidebarMenuButton isActive={$page.url.pathname === item.url}>
										{#snippet child({ props })}
											<a href={item.url} {...props}>
												<FileBarChart class="h-4 w-4" />
												<span class="text-xs">{item.title}</span>
											</a>
										{/snippet}
									</SidebarMenuButton>
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>

		<!-- Calculations Collapsible -->
		<Collapsible bind:open={isSettingsOpen} class="group/collapsible -mt-2">
			<SidebarGroup>
				<CollapsibleTrigger>
					{#snippet child({ props })}
						<SidebarGroupLabel
							{...props}
							class="flex w-full cursor-pointer items-center justify-between hover:bg-sidebar-accent"
						>
							<span>Settings</span>
							<ChevronRight
								class="h-4 w-4 transition-transform {isSettingsOpen ? 'rotate-90' : ''}"
							/>
						</SidebarGroupLabel>
					{/snippet}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{#each settingsNav as item}
								<SidebarMenuItem>
									<SidebarMenuButton isActive={$page.url.pathname === item.url}>
										{#snippet child({ props })}
											<a href={item.url} {...props}>
												<item.icon class="h-4 w-4" />
												<span class="text-xs">{item.title}</span>
											</a>
										{/snippet}
									</SidebarMenuButton>
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	</SidebarContent>

	<!-- Footer -->
	<SidebarFooter class="bg-white pb-10">
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton class="flex w-full">
					{#snippet child({ props })}
						<div class="flex w-full items-center gap-2">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-semibold text-white"
							>
								{userInitials}
							</div>
							<div class="flex flex-1 flex-col gap-0.5 text-left leading-none">
								<span class="text-sm font-semibold">
									{data?.user?.first_name
										? `${data.user.first_name} ${data.user.last_name?.[0]}.`
										: 'Accountant'}
								</span> <span class="text-xs text-muted-foreground">Accountant</span>
							</div>
							<form method="POST" action="/logout">
								<button
									type="submit"
									class="text-muted-foreground transition-colors hover:text-red-500"
									title="Logout"
								>
									<LogOut class="h-4 w-4" />
								</button>
							</form>
						</div>
					{/snippet}
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</Sidebar>
