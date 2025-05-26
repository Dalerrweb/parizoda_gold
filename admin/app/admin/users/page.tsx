import { SidebarTrigger } from "@/components/ui/sidebar";

export default function UsersPage() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<div className="flex flex-1 items-center gap-2">
					<h1 className="text-lg font-semibold">Users</h1>
				</div>
			</header>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">Users</h2>
				</div>

				<div className="rounded-md border">
					<div className="p-4">
						<p className="text-muted-foreground">
							Users page content will go here.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
