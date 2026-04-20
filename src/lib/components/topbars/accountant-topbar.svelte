<script lang="ts">
	import { page } from '$app/stores';
	import { SidebarTrigger } from '$lib/components/ui/sidebar';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { BadgeCheckIcon, Bell, LogOut, Settings, User } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	const user = {
		name: 'John Doe',
		email: 'john@example.com',
		avatar: '',
		initials: 'JD'
	};

	const { data } = $props<{
		data: {
			user: { first_name: string; middle_name: string; last_name: string; role: string } | null;
		};
	}>();

	const segments = $derived($page.url.pathname.split('/').filter(Boolean));
	const pageTitle = $derived(
		$page.data.folder?.name ??
			[...segments]
				.pop()
				?.replace(/-/g, ' ')
				.replace(/\b\w/g, (c) => c.toUpperCase()) ??
			'Dashboard'
	);
</script>

<header class="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4 py-2">
	<!-- Left: sidebar trigger + separator -->
	<SidebarTrigger class="-ml-1" />
	<Separator orientation="vertical" class="h-4" />
	<div class="ml-2 hidden flex-col md:flex">
		<span class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
			>Accountant Portal</span
		>
		<span class="max-w-[150px] truncate text-sm font-bold">{pageTitle}</span>
	</div>
	<!-- Middle: page title slot (optional) -->
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<div class="flex-1" />

	<!-- Right: notifications + user menu -->
	<div class="flex items-center gap-2">
		<!-- Notification bell -->
		<Badge
			variant="secondary"
			class="flex items-center gap-2 border border-emerald-200 bg-emerald-100 text-emerald-700 transition-all hover:bg-emerald-200 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
		>
			<BadgeCheckIcon class="h-4 w-4" />
			<a href="https://www.facebook.com/Ernesto4218" class="font-medium">
				Developed By: <span class="font-bold">Ernesto C. Sabornido</span>
			</a>
		</Badge>

		<Button variant="ghost" size="icon" class="relative">
			<Bell class="h-4 w-4" />
			<span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
		</Button>

		<!-- User dropdown -->
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar class="h-8 w-8 cursor-pointer">
					<AvatarImage src={user.avatar} alt={user.name} />
					<AvatarFallback class="text-xs">
						{data.user.first_name[0].toUpperCase() + data.user.last_name[0].toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" class="w-56">
				<DropdownMenuLabel>
					<p class="text-sm font-medium">
						{data?.user?.first_name
							? `${data.user.first_name} ${data.user.last_name?.[0]}.`
							: 'Accountant'}
					</p>
					<p class="text-xs text-muted-foreground capitalize">{data.user.role}</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<User class="mr-2 h-4 w-4" />
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings class="mr-2 h-4 w-4" />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<a href="/login">
					<DropdownMenuItem class="text-red-500 focus:text-red-500">
						<LogOut class="mr-2 h-4 w-4" />
						Log out
					</DropdownMenuItem>
				</a>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</header>
