import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Search,
	Plus,
	MoreHorizontal,
	Eye,
	Edit,
	Package,
	DollarSign,
	FolderOpen,
	Clock,
	X,
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductItemRow from "./ProductItemRow";
import { Product } from "@/app/types";

export default async function ProductsPage({ searchParams }: any) {
	const params = await searchParams;
	const searchQuery =
		typeof params.search === "string" ? params.search : undefined;

	const auPrice = await prisma.auPrice.findFirst();

	const products = await prisma.product.findMany({
		where: {
			...(searchQuery && {
				OR: [
					{ sku: { contains: searchQuery, mode: "insensitive" } },
					{ name: { contains: searchQuery, mode: "insensitive" } },
					{
						description: {
							contains: searchQuery,
							mode: "insensitive",
						},
					},
				],
			}),
		},
		include: {
			category: true,
			images: true,
			orders: true,
			sizes: true,
			parentBundle: {
				include: {
					child: {
						include: {
							sizes: true,
						},
					},
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const totalProducts = products.length;
	const productsWithOrders = products.filter(
		(product) => product.orders.length > 0
	).length;
	// const totalRevenue = products.reduce(
	// 	(sum, product) => sum + product.price * product.orders.length,
	// 	0
	// );
	const recentProducts = products.filter((product) => {
		const daysDiff =
			(Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24);
		return daysDiff <= 7;
	}).length;

	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<div className="flex flex-1 items-center gap-2">
					<h1 className="text-lg font-semibold">Products</h1>
				</div>
			</header>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">
						Products Management
					</h2>
					<Link href="/admin/products/create">
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Product
						</Button>
					</Link>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Products
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalProducts}
							</div>
							<p className="text-xs text-muted-foreground">
								In inventory
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Products Sold
							</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{productsWithOrders}
							</div>
							<p className="text-xs text-muted-foreground">
								With orders
							</p>
						</CardContent>
					</Card>

					{/* <Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Revenue
							</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{formatPrice(totalRevenue)}
							</div>
							<p className="text-xs text-muted-foreground">
								Total sales
							</p>
						</CardContent>
					</Card> */}

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								New This Week
							</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{recentProducts}
							</div>
							<p className="text-xs text-muted-foreground">
								Recent additions
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Products Table */}
				<Card>
					<CardHeader className="flex items-start justify-between">
						<div>
							<CardTitle>Products</CardTitle>
							<CardDescription>
								Manage your product inventory and details
							</CardDescription>
						</div>
						<Button variant="outline">
							<FolderOpen className="mr-2 h-4 w-4" />
							Categories
						</Button>
					</CardHeader>
					<CardContent>
						<form
							action="/admin/products"
							method="GET"
							className="relative flex-1 mb-4 "
						>
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search products..."
								className="pl-8"
								name="search" // Имя параметра в URL
								defaultValue={searchQuery || ""} // Текущее значение поиска
							/>
							{/* Кнопка сброса поиска */}
							{searchQuery && (
								<Link
									href="/admin/products"
									className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
								>
									<X className="h-4 w-4" />
								</Link>
							)}
						</form>

						{/* <Button variant="outline">Filter</Button> */}

						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Product</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Images</TableHead>
										<TableHead>Orders</TableHead>
										<TableHead>Updated</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products.map((product) => (
										<ProductItemRow
											key={product.id}
											product={product as any}
										/>
									))}
								</TableBody>
							</Table>
						</div>

						<div className="flex items-center justify-between space-x-2 py-4">
							<div className="text-sm text-muted-foreground">
								Showing 1-{products.length} of {products.length}{" "}
								products
							</div>
							<div className="flex space-x-2">
								<Button variant="outline" size="sm" disabled>
									Previous
								</Button>
								<Button variant="outline" size="sm" disabled>
									Next
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
