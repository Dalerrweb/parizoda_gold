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
	Trash2,
	Package,
	DollarSign,
	FolderOpen,
	Clock,
} from "lucide-react";

// Mock data based on your Product model
const mockProducts = [
	{
		id: 1,
		name: "iPhone 15 Pro",
		description:
			"Latest iPhone with advanced camera system and titanium design",
		price: 99900, // Price in cents/tiyins
		categoryId: 1,
		category: { id: 1, name: "Electronics" },
		images: [
			{ id: 1, url: "/placeholder.svg?height=60&width=60" },
			{ id: 2, url: "/placeholder.svg?height=60&width=60" },
		],
		orders: [{ id: 1 }, { id: 2 }],
		createdAt: new Date("2024-01-15T10:30:00Z"),
		updatedAt: new Date("2024-02-01T14:20:00Z"),
	},
	{
		id: 2,
		name: "MacBook Air M3",
		description: "Powerful laptop with M3 chip and all-day battery life",
		price: 119900,
		categoryId: 1,
		category: { id: 1, name: "Electronics" },
		images: [{ id: 3, url: "/placeholder.svg?height=60&width=60" }],
		orders: [{ id: 3 }],
		createdAt: new Date("2024-01-20T08:15:00Z"),
		updatedAt: new Date("2024-01-25T16:45:00Z"),
	},
	{
		id: 3,
		name: "Premium Cotton T-Shirt",
		description: "Comfortable and stylish cotton t-shirt for everyday wear",
		price: 2999,
		categoryId: 2,
		category: { id: 2, name: "Clothing" },
		images: [
			{ id: 4, url: "/placeholder.svg?height=60&width=60" },
			{ id: 5, url: "/placeholder.svg?height=60&width=60" },
			{ id: 6, url: "/placeholder.svg?height=60&width=60" },
		],
		orders: [],
		createdAt: new Date("2024-02-01T12:00:00Z"),
		updatedAt: new Date("2024-02-01T12:00:00Z"),
	},
	{
		id: 4,
		name: "Wireless Headphones",
		description: "High-quality wireless headphones with noise cancellation",
		price: 15999,
		categoryId: 1,
		category: { id: 1, name: "Electronics" },
		images: [{ id: 7, url: "/placeholder.svg?height=60&width=60" }],
		orders: [{ id: 4 }, { id: 5 }],
		createdAt: new Date("2024-02-05T09:30:00Z"),
		updatedAt: new Date("2024-02-10T11:15:00Z"),
	},
	{
		id: 5,
		name: "Designer Jeans",
		description: null,
		price: 7999,
		categoryId: 2,
		category: { id: 2, name: "Clothing" },
		images: [],
		orders: [{ id: 6 }],
		createdAt: new Date("2024-02-10T14:20:00Z"),
		updatedAt: new Date("2024-02-12T10:30:00Z"),
	},
];

function formatPrice(price: number) {
	// Assuming price is in cents/tiyins, convert to dollars/som
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(price / 100);
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}

export default function ProductsPage() {
	const totalProducts = mockProducts.length;
	const productsWithOrders = mockProducts.filter(
		(product) => product.orders.length > 0
	).length;
	const totalRevenue = mockProducts.reduce(
		(sum, product) => sum + product.price * product.orders.length,
		0
	);
	const recentProducts = mockProducts.filter((product) => {
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
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Add Product
					</Button>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-4">
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

					<Card>
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
					</Card>

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
					<CardHeader>
						<CardTitle>Products</CardTitle>
						<CardDescription>
							Manage your product inventory and details
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2 mb-4">
							<div className="relative flex-1">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search products..."
									className="pl-8"
								/>
							</div>
							<Button variant="outline">Filter</Button>
							<Button variant="outline">
								<FolderOpen className="mr-2 h-4 w-4" />
								Categories
							</Button>
						</div>

						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Product</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Images</TableHead>
										<TableHead>Orders</TableHead>
										<TableHead>Updated</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{mockProducts.map((product) => (
										<TableRow key={product.id}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<div className="h-12 w-12 rounded-lg border overflow-hidden bg-muted">
														{product.images.length >
														0 ? (
															<img
																src={
																	product
																		.images[0]
																		.url ||
																	"/placeholder.svg"
																}
																alt={
																	product.name
																}
																className="h-full w-full object-cover"
															/>
														) : (
															<div className="h-full w-full flex items-center justify-center">
																<Package className="h-6 w-6 text-muted-foreground" />
															</div>
														)}
													</div>
													<div className="max-w-[200px]">
														<div className="font-medium truncate">
															{product.name}
														</div>
														<div className="text-sm text-muted-foreground truncate">
															{product.description ||
																"No description"}
														</div>
														<div className="text-xs text-muted-foreground">
															ID: {product.id}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline">
													{product.category.name}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="font-medium">
													{formatPrice(product.price)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center space-x-2">
													<span className="font-medium">
														{product.images.length}
													</span>
													<span className="text-muted-foreground text-sm">
														{product.images
															.length === 1
															? "image"
															: "images"}
													</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center space-x-2">
													<span className="font-medium">
														{product.orders.length}
													</span>
													{product.orders.length >
														0 && (
														<Badge
															variant="default"
															className="text-xs"
														>
															Selling
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="text-sm">
													{formatDate(
														product.updatedAt
													)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															variant="ghost"
															className="h-8 w-8 p-0"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Edit className="mr-2 h-4 w-4" />
															Edit Product
														</DropdownMenuItem>
														<DropdownMenuItem className="text-destructive">
															<Trash2 className="mr-2 h-4 w-4" />
															Delete Product
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						<div className="flex items-center justify-between space-x-2 py-4">
							<div className="text-sm text-muted-foreground">
								Showing 1-{mockProducts.length} of{" "}
								{mockProducts.length} products
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
