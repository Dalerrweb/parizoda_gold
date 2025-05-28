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

import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Search, Plus, FolderOpen, Package, Clock } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import CategoryRow from "@/components/custom/CategoryRow";
import { Category } from "@/app/types";

export default async function CategoriesPage() {
	const categories = await prisma.category.findMany({
		include: {
			products: true,
		},
	});

	const totalCategories = categories.length;
	const categoriesWithProducts = categories.filter(
		(cat) => cat.products.length > 0
	).length;
	const totalProducts = categories.reduce(
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
					<Link href="/admin/categories/create">
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Category
						</Button>
					</Link>
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
									{categories.map((category) => (
										<CategoryRow
											key={category.id}
											category={category as any}
										/>
									))}
								</TableBody>
							</Table>
						</div>

						<div className="flex items-center justify-between space-x-2 py-4">
							<div className="text-sm text-muted-foreground">
								Showing 1-{categories.length} of{" "}
								{categories.length} categories
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
