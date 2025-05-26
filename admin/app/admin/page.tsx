import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Users, ShoppingBag, Package, ImageIcon } from "lucide-react";

export default function DashboardPage() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<div className="flex flex-1 items-center gap-2">
					<h1 className="text-lg font-semibold">Dashboard</h1>
				</div>
			</header>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">
						Dashboard
					</h2>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Users
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">1,234</div>
							<p className="text-xs text-muted-foreground">
								+20.1% from last month
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Orders
							</CardTitle>
							<ShoppingBag className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">856</div>
							<p className="text-xs text-muted-foreground">
								+12.5% from last month
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Products
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">342</div>
							<p className="text-xs text-muted-foreground">
								+8.2% from last month
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Active Banners
							</CardTitle>
							<ImageIcon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">12</div>
							<p className="text-xs text-muted-foreground">
								+2 from last month
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card className="col-span-4">
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>
								Overview of recent dashboard activity
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center space-x-4">
									<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium">
											New user registered
										</p>
										<p className="text-xs text-muted-foreground">
											2 minutes ago
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-4">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium">
											Product updated
										</p>
										<p className="text-xs text-muted-foreground">
											5 minutes ago
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-4">
									<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium">
											New order received
										</p>
										<p className="text-xs text-muted-foreground">
											10 minutes ago
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="col-span-3">
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>
								Common administrative tasks
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<button className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors">
								Add New User
							</button>
							<button className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors">
								Create Product
							</button>
							<button className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors">
								Upload Banner
							</button>
							<button className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors">
								View Reports
							</button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
