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
import { Search, Plus, FolderOpen, Package, Clock, X } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import CategoryRow from "@/components/custom/CategoryRow";
import { PaginationControls } from "@/components/custom/pagination-controls";

const ITEMS_PER_PAGE = 10;

export default async function CategoriesPage({ searchParams }: any) {
	const params = await searchParams;
	const searchQuery =
		typeof params.search === "string" ? params.search : undefined;
	const currentPage =
		typeof params.page === "string" ? Number.parseInt(params.page) : 1;
	const itemsPerPage =
		typeof params.limit === "string"
			? Number.parseInt(params.limit)
			: ITEMS_PER_PAGE;

	const whereClause = {
		...(searchQuery && {
			OR: [{ name: { contains: searchQuery, mode: "insensitive" } }],
		}),
	};

	const totalCategories = await prisma.category.count({
		where: whereClause,
	});

	const categories = await prisma.category.findMany({
		where: whereClause,
		include: {
			products: true,
		},
		orderBy: {
			createdAt: "desc",
		},
		skip: (currentPage - 1) * itemsPerPage,
		take: itemsPerPage,
	});

	const totalPages = Math.ceil(totalCategories / itemsPerPage);
	const hasNextPage = currentPage < totalPages;
	const hasPrevPage = currentPage > 1;

	const allCategories = await prisma.category.findMany({
		include: {
			products: true,
		},
	});

	const totalCategoriesCount = allCategories.length;
	const categoriesWithProducts = allCategories.filter(
		(cat) => cat.products.length > 0
	).length;
	const totalProducts = allCategories.reduce(
		(sum, cat) => sum + cat.products.length,
		0
	);

	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<div className="flex flex-1 items-center gap-2">
					<h1 className="text-lg font-semibold">Категории</h1>
				</div>
			</header>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">
						Управление категориями
					</h2>
					<Link href="/admin/categories/create">
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Добавить категорию
						</Button>
					</Link>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Общее кол-во категорий
							</CardTitle>
							<FolderOpen className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalCategoriesCount}
							</div>
							<p className="text-xs text-muted-foreground">
								Категорий товаров
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Активные категории
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{categoriesWithProducts}
							</div>
							<p className="text-xs text-muted-foreground">
								К товарам
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Общее кол-во продуктов
							</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalProducts}
							</div>
							<p className="text-xs text-muted-foreground">
								По всем категриям
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Categories Table */}
				<Card>
					<CardHeader>
						<CardTitle>Категории</CardTitle>
						<CardDescription>
							Управление категориями
						</CardDescription>
					</CardHeader>
					<CardContent>
						{/* Search Form */}
						<form
							action="/admin/categories"
							method="GET"
							className="relative flex-1 mb-4"
						>
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search categories..."
								className="pl-8"
								name="search"
								defaultValue={searchQuery || ""}
							/>
							{/* Hidden inputs to preserve pagination settings */}
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
									href="/admin/categories"
									className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
								>
									<X className="h-4 w-4" />
								</Link>
							)}
						</form>

						{/* Active Search Filter Display */}
						{searchQuery && (
							<div className="flex flex-wrap gap-2 mb-4">
								<span className="text-sm text-muted-foreground">
									Фильтры:
								</span>
								<div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
									<span>Поиск: {searchQuery}</span>
									<Link
										href="/admin/categories"
										className="text-muted-foreground hover:text-foreground"
									>
										<X className="h-3 w-3" />
									</Link>
								</div>
								<Link
									href="/admin/categories"
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
										<TableHead>Категория</TableHead>
										<TableHead>Кол-во товаров</TableHead>
										<TableHead>Статус</TableHead>
										<TableHead>Создано</TableHead>
										<TableHead className="text-right">
											Действия
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{categories.length === 0 ? (
										<tr>
											<td
												colSpan={5}
												className="text-center py-8 text-muted-foreground"
											>
												Категорий не найдено
											</td>
										</tr>
									) : (
										categories.map((category) => (
											<CategoryRow
												key={category.id}
												category={category as any}
											/>
										))
									)}
								</TableBody>
							</Table>
						</div>

						{/* Pagination Controls */}
						<PaginationControls
							currentPage={currentPage}
							totalPages={totalPages}
							itemsPerPage={itemsPerPage}
							hasNextPage={hasNextPage}
							hasPrevPage={hasPrevPage}
							searchQuery={searchQuery}
							totalAmount={totalCategories}
							pathName="categories"
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
