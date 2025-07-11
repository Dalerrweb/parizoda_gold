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
import {
	Search,
	Plus,
	Package,
	DollarSign,
	FolderOpen,
	Clock,
	X,
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductItemRow from "./ProductItemRow";
import { CategoryFilter } from "./components/category-filter";
import { PaginationControls } from "@/components/custom/pagination-controls";

const ITEMS_PER_PAGE = 10;

export default async function ProductsPage({ searchParams }: any) {
	const params = await searchParams;
	const searchQuery =
		typeof params.search === "string" ? params.search : undefined;
	const categoryFilter =
		typeof params.category === "string" ? params.category : undefined;
	const currentPage =
		typeof params.page === "string" ? Number.parseInt(params.page) : 1;
	const itemsPerPage =
		typeof params.limit === "string"
			? Number.parseInt(params.limit)
			: ITEMS_PER_PAGE;

	const categories = await prisma.category.findMany({
		orderBy: { name: "asc" },
	});

	const whereClause = {
		...(searchQuery && {
			OR: [
				{ sku: { contains: searchQuery, mode: "insensitive" } },
				{ name: { contains: searchQuery, mode: "insensitive" } },
				{ description: { contains: searchQuery, mode: "insensitive" } },
			],
		}),
		...(categoryFilter &&
			categoryFilter !== "all" && {
				categoryId: Number(categoryFilter),
			}),
	};

	const totalProducts = await prisma.product.count({
		where: whereClause,
	});

	const products = await prisma.product.findMany({
		where: whereClause,
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
		skip: (currentPage - 1) * itemsPerPage,
		take: itemsPerPage,
	});

	const totalPages = Math.ceil(totalProducts / itemsPerPage);
	const hasNextPage = currentPage < totalPages;
	const hasPrevPage = currentPage > 1;

	const allProducts = await prisma.product.findMany({
		include: {
			orders: true,
		},
	});

	const totalProductsCount = allProducts.length;
	const productsWithOrders = allProducts.filter(
		(product) => product.orders.length > 0
	).length;

	const recentProducts = allProducts.filter((product) => {
		const daysDiff =
			(Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24);
		return daysDiff <= 7;
	}).length;

	const buildUrl = (
		newParams: Record<string, string | number | undefined>
	) => {
		const url = new URLSearchParams();

		if (searchQuery) url.set("search", searchQuery);
		if (categoryFilter && categoryFilter !== "all")
			url.set("category", categoryFilter);
		if (currentPage > 1) url.set("page", currentPage.toString());
		if (itemsPerPage !== ITEMS_PER_PAGE)
			url.set("limit", itemsPerPage.toString());

		Object.entries(newParams).forEach(([key, value]) => {
			if (value !== undefined && value !== "") {
				url.set(key, value.toString());
			} else {
				url.delete(key);
			}
		});

		return `/admin/products?${url.toString()}`;
	};

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
						Управления товарами
					</h2>
					<Link href="/admin/products/create">
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Добавить товар
						</Button>
					</Link>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Общее кол-во товаров
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalProductsCount}
							</div>
							<p className="text-xs text-muted-foreground">
								на складе
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Продуктов продано
							</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{productsWithOrders}
							</div>
							<p className="text-xs text-muted-foreground">
								Заказано
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Новые товары за последнюю неделю
							</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{recentProducts}
							</div>
							<p className="text-xs text-muted-foreground">
								Недавно добавленные
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Products Table */}
				<Card>
					<CardHeader className="flex items-start justify-between">
						<div>
							<CardTitle>Товары</CardTitle>
							<CardDescription>
								Управляйте складом и деталями товаров
							</CardDescription>
						</div>
						{/* Category Filter */}
						<CategoryFilter
							categories={categories}
							currentCategory={categoryFilter || "all"}
							searchQuery={searchQuery}
							currentPage={currentPage}
							itemsPerPage={itemsPerPage}
						/>
					</CardHeader>
					<CardContent>
						{/* Filters */}
						<div className="flex flex-col sm:flex-row gap-4 mb-4">
							{/* Search Form */}
							<form
								action="/admin/products"
								method="GET"
								className="relative flex-1"
							>
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search products..."
									className="pl-8"
									name="search"
									defaultValue={searchQuery || ""}
								/>
								{/* Hidden inputs to preserve other filters */}
								{categoryFilter && categoryFilter !== "all" && (
									<input
										type="hidden"
										name="category"
										value={categoryFilter}
									/>
								)}
								{currentPage > 1 && (
									<input
										type="hidden"
										name="page"
										value={currentPage}
									/>
								)}
								{itemsPerPage !== ITEMS_PER_PAGE && (
									<input
										type="hidden"
										name="limit"
										value={itemsPerPage}
									/>
								)}

								{/* Clear search button */}
								{searchQuery && (
									<Link
										href={buildUrl({
											search: undefined,
											page: 1,
										})}
										className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
									>
										<X className="h-4 w-4" />
									</Link>
								)}
							</form>
						</div>

						{/* Active Filters Display */}
						{(searchQuery ||
							(categoryFilter && categoryFilter !== "all")) && (
							<div className="flex flex-wrap gap-2 mb-4">
								<span className="text-sm text-muted-foreground">
									Активные фильтры:
								</span>
								{searchQuery && (
									<div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
										<span>Поиск: {searchQuery}</span>
										<Link
											href={buildUrl({
												search: undefined,
												page: 1,
											})}
											className="text-muted-foreground hover:text-foreground"
										>
											<X className="h-3 w-3" />
										</Link>
									</div>
								)}
								{categoryFilter && categoryFilter !== "all" && (
									<div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
										<span>
											Категория:{" "}
											{
												categories.find(
													(c) =>
														c.id === categoryFilter
												)?.name
											}
										</span>
										<Link
											href={buildUrl({
												category: undefined,
												page: 1,
											})}
											className="text-muted-foreground hover:text-foreground"
										>
											<X className="h-3 w-3" />
										</Link>
									</div>
								)}
								<Link
									href="/admin/products"
									className="text-sm text-muted-foreground hover:text-foreground underline"
								>
									Очистить все
								</Link>
							</div>
						)}

						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Товар</TableHead>
										<TableHead>Категория</TableHead>
										<TableHead>Картинки</TableHead>
										<TableHead>Заказы</TableHead>
										<TableHead>Обновлено</TableHead>
										<TableHead className="text-right">
											Действия
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products.length === 0 ? (
										<tr>
											<td
												colSpan={6}
												className="text-center py-8 text-muted-foreground"
											>
												Товары не найдены
											</td>
										</tr>
									) : (
										products.map((product) => (
											<ProductItemRow
												key={product.id}
												product={product as any}
											/>
										))
									)}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						<PaginationControls
							currentPage={currentPage}
							totalPages={totalPages}
							totalAmount={totalProducts}
							itemsPerPage={itemsPerPage}
							hasNextPage={hasNextPage}
							hasPrevPage={hasPrevPage}
							searchQuery={searchQuery}
							categoryFilter={categoryFilter}
							pathName="products"
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
