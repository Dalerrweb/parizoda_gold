import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Users, ShoppingBag, Package, ImageIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function DashboardPage() {
	const [totalUsers, totalProduct, totalBanners, totalOrders, GoldPrice] =
		await Promise.all([
			prisma.user.count(),
			prisma.product.count(),
			prisma.banner.count(),
			prisma.order.count(),
			prisma.auPrice.findFirst(),
		]);

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
							<div className="text-2xl font-bold">
								{totalUsers}
							</div>
							<p className="text-xs text-muted-foreground">
								All time
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
							<div className="text-2xl font-bold">
								{totalOrders}
							</div>
							<p className="text-xs text-muted-foreground">
								All time
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
							<div className="text-2xl font-bold">
								{totalProduct}
							</div>
							<p className="text-xs text-muted-foreground">
								All time
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
							<div className="text-2xl font-bold">
								{totalBanners}
							</div>
							<p className="text-xs text-muted-foreground">
								Amount of active banner
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card className="col-span-4">
						<CardHeader>
							<CardTitle>Золото</CardTitle>
							<CardDescription>
								Цена за грам золота
							</CardDescription>
						</CardHeader>
						<CardContent>
							{formatPrice(Number(GoldPrice?.pricePerGram))} за
							один грам золота
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
