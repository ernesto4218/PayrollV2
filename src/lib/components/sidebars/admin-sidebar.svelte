<script lang="ts">
	import { env } from '$env/dynamic/public';

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
		GraduationCap,
		LayoutDashboard,
		Users,
		Settings,
		ShieldCheck,
		BookOpen,
		CalendarCheck,
		ClipboardList,
		Megaphone,
		BarChart3,
		UserCheck,
		FileText,
		HelpCircle,
		HardDrive,
		Image,
		Film,
		FolderOpen,
		FileArchive,
		ChevronRight
	} from 'lucide-svelte';

	// State management for collapsible sections (Svelte 5 Runes)
	let isAcademicOpen = $state(true);
	let isStorageOpen = $state(true);
	let isSystemOpen = $state(true);

	const mainNav = [
		{ title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
		{ title: 'Teachers', url: '/admin/teachers', icon: UserCheck },
		{ title: 'Students', url: '/admin/students', icon: Users },
		{ title: 'Subjects', url: '/admin/subjects', icon: BookOpen },
		{ title: 'Grades', url: '/admin/grades', icon: ClipboardList },
		{ title: 'Announcements', url: '/admin/announcements', icon: Megaphone },
		{ title: 'Analytics', url: '/admin/analytics', icon: BarChart3 }
	];

	const storageNav = [
		{ title: 'All Files', url: '/admin/storage/all', icon: HardDrive },
		{ title: 'Media Library', url: '/admin/storage/media', icon: Image },
		{ title: 'Video Archives', url: '/admin/storage/videos', icon: Film },
		{ title: 'Documents', url: '/admin/storage/documents', icon: FolderOpen },
		{ title: 'Explorer', url: '/admin/storage/explorer', icon: FolderOpen }
	];

	const systemNav = [
		{ title: 'Users & Roles', url: '/admin/users', icon: ShieldCheck },
		{ title: 'Reports', url: '/admin/reports', icon: FileText },
		{ title: 'Settings', url: '/admin/settings', icon: Settings },
		{ title: 'Help', url: '/admin/help', icon: HelpCircle }
	];
</script>

<Sidebar>
	<SidebarHeader class="bg-white">
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					class="cursor-default hover:bg-transparent active:bg-transparent"
				>
					<div
						class="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
					>
						<GraduationCap class="h-4 w-4" />
					</div>
					<div class="flex flex-col gap-0.5 leading-none">
						<span class="font-semibold">{env.PUBLIC_SHORT_NAME}</span>
						<span class="text-xs text-muted-foreground">Portal</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>

	<SidebarContent class="flex flex-col gap-0 bg-white">
		<Collapsible bind:open={isAcademicOpen} class="group/collapsible">
			<SidebarGroup>
				<CollapsibleTrigger>
					{#snippet child({ props })}
						<SidebarGroupLabel
							{...props}
							class="flex w-full cursor-pointer items-center justify-between transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<span>Academic</span>
							<ChevronRight
								class="h-4 w-4 transition-transform duration-200 {isAcademicOpen
									? 'rotate-90'
									: ''}"
							/>
						</SidebarGroupLabel>
					{/snippet}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{#each mainNav as item}
								{@const isActive =
									$page.url.pathname === item.url || $page.url.pathname.startsWith(item.url + '/')}
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
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>

		<Collapsible bind:open={isStorageOpen} class="group/collapsible -mt-2">
			<SidebarGroup>
				<CollapsibleTrigger>
					{#snippet child({ props })}
						<SidebarGroupLabel
							{...props}
							class="flex w-full cursor-pointer items-center justify-between transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<span>Storage & Assets</span>
							<ChevronRight
								class="h-4 w-4 transition-transform duration-200 {isStorageOpen ? 'rotate-90' : ''}"
							/>
						</SidebarGroupLabel>
					{/snippet}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{#each storageNav as item}
								{@const isActive =
									$page.url.pathname === item.url || $page.url.pathname.startsWith(item.url + '/')}
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
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>

		<Collapsible bind:open={isSystemOpen} class="group/collapsible -mt-2">
			<SidebarGroup>
				<CollapsibleTrigger>
					{#snippet child({ props })}
						<SidebarGroupLabel
							{...props}
							class="flex w-full cursor-pointer items-center justify-between transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<span>System</span>
							<ChevronRight
								class="h-4 w-4 transition-transform duration-200 {isSystemOpen ? 'rotate-90' : ''}"
							/>
						</SidebarGroupLabel>
					{/snippet}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{#each systemNav as item}
								{@const isActive =
									$page.url.pathname === item.url || $page.url.pathname.startsWith(item.url + '/')}
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
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	</SidebarContent>

	<SidebarFooter class="bg-white pb-10">
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton class="flex w-full">
					{#snippet child({ props })}
						<button type="button" {...props} class="{props.class} flex w-full">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground"
							>
								SA
							</div>
							<div class="flex flex-col gap-0.5 text-left leading-none">
								<span class="text-sm font-semibold">Super Admin</span>
								<span class="text-xs text-muted-foreground">Full system access</span>
							</div>
						</button>
					{/snippet}
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</Sidebar>
