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
	FolderOpen,
	Package,
	Clock,
} from "lucide-react";

// Mock data based on your Category model
const mockCategories = [
	{
		id: 1,
		name: "Electronics",
		imageUrl: "/placeholder.svg?height=60&width=60",
		products: [
			{ id: 1, name: "Smartphone" },
			{ id: 2, name: "Laptop" },
			{ id: 3, name: "Headphones" },
		],
		createdAt: new Date("2024-01-10T08:00:00Z"),
	},
	{
		id: 2,
		name: "Clothing",
		imageUrl: "/placeholder.svg?height=60&width=60",
		products: [
			{ id: 4, name: "T-Shirt" },
			{ id: 5, name: "Jeans" },
		],
		createdAt: new Date("2024-01-15T10:30:00Z"),
	},
	{
		id: 3,
		name: "Home & Garden",
		imageUrl: "/placeholder.svg?height=60&width=60",
		products: [{ id: 6, name: "Plant Pot" }],
		createdAt: new Date("2024-02-01T14:20:00Z"),
	},
	{
		id: 4,
		name: "Books",
		imageUrl: "/placeholder.svg?height=60&width=60",
		products: [],
		createdAt: new Date("2024-02-10T16:45:00Z"),
	},
];

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}

export default function CategoriesPage() {
	const totalCategories = mockCategories.length;
	const categoriesWithProducts = mockCategories.filter(
		(cat) => cat.products.length > 0
	).length;
	const totalProducts = mockCategories.reduce(
		(sum, cat) => sum + cat.products.length,
		0
	);

	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<div className="flex flex-1 items-center gap-2">
					<h1 className="text-lg font-semibold">Categories</h1>
				</div>
			</header>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">
						Categories Management
					</h2>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Add Category
					</Button>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Categories
							</CardTitle>
							<FolderOpen className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalCategories}
							</div>
							<p className="text-xs text-muted-foreground">
								Product categories
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Active Categories
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{categoriesWithProducts}
							</div>
							<p className="text-xs text-muted-foreground">
								With products
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Products
							</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalProducts}
							</div>
							<p className="text-xs text-muted-foreground">
								Across all categories
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Categories Table */}
				<Card>
					<CardHeader>
						<CardTitle>Categories</CardTitle>
						<CardDescription>
							Manage product categories and their organization
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2 mb-4">
							<div className="relative flex-1">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search categories..."
									className="pl-8"
								/>
							</div>
							<Button variant="outline">Filter</Button>
						</div>

						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Category</TableHead>
										<TableHead>Products Count</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{mockCategories.map((category) => (
										<TableRow key={category.id}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<img
														src={
															category.imageUrl ||
															"/placeholder.svg"
														}
														alt={category.name}
														className="h-12 w-12 rounded-lg object-cover border"
													/>
													<div>
														<div className="font-medium">
															{category.name}
														</div>
														<div className="text-sm text-muted-foreground">
															ID: {category.id}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center space-x-2">
													<span className="font-medium">
														{
															category.products
																.length
														}
													</span>
													<span className="text-muted-foreground text-sm">
														products
													</span>
												</div>
											</TableCell>
											<TableCell>
												{category.products.length >
												0 ? (
													<Badge variant="default">
														Active
													</Badge>
												) : (
													<Badge variant="secondary">
														Empty
													</Badge>
												)}
											</TableCell>
											<TableCell>
												<div className="text-sm">
													{formatDate(
														category.createdAt
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
															View Products
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Edit className="mr-2 h-4 w-4" />
															Edit Category
														</DropdownMenuItem>
														<DropdownMenuItem className="text-destructive">
															<Trash2 className="mr-2 h-4 w-4" />
															Delete Category
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
								Showing 1-{mockCategories.length} of{" "}
								{mockCategories.length} categories
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
