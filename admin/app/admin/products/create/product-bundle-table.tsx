"use client";

import {
	useState,
	useEffect,
	useCallback,
	Dispatch,
	SetStateAction,
} from "react";
import {
	Search,
	X,
	ShoppingCart,
	Plus,
	Loader2,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Product as MainProductType, ProductType } from "@/app/types";
import { useParams } from "next/navigation";

type Product = Required<MainProductType>;

interface ProductBundle {
	parentId: number;
	childId: number;
	quantity: number;
}

interface ApiResponse {
	products: Product[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

interface ProductBundleTableProps {
	useFormData: [any[], Dispatch<SetStateAction<MainProductType>>];
	editingElemntId?: string;
}

const ITEMS_PER_PAGE = 10;
const PARENT_ID = 1;

export default function ProductBundle({
	useFormData: [childBundles, setFormData],
	editingElemntId,
}: ProductBundleTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedProducts, setSelectedProducts] =
		useState<ProductBundle[]>(childBundles);

	const [products, setProducts] = useState<Product[]>([]);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: ITEMS_PER_PAGE,
		total: 0,
		pages: 0,
	});
	const [loading, setLoading] = useState(false);
	const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
		null
	);
	const [productsCache, setProductsCache] = useState<Record<number, Product>>(
		{}
	);

	// Fetch products from API
	const fetchProducts = useCallback(async (page = 1, search = "") => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: ITEMS_PER_PAGE.toString(),
				type: ProductType.SINGLE,
			});

			if (search.trim()) {
				params.append("search", search.trim());
			}

			const response = await fetch(`/api/admin/product?${params}`);

			if (!response.ok) {
				throw new Error("Failed to fetch products");
			}

			const data: ApiResponse = await response.json();
			setProducts(data.products);

			// Обновляем кэш продуктов
			setProductsCache((prev) => {
				const newCache = { ...prev };
				data.products.forEach((product) => {
					newCache[product.id] = product;
				});
				return newCache;
			});

			setPagination(data.pagination);
			setCurrentPage(page);
		} catch (error) {
			console.error("Error fetching products:", error);
			toast.error("Failed to fetch products. Please try again.");
		} finally {
			setLoading(false);
		}
	}, []);

	// Initial load
	useEffect(() => {
		fetchProducts(1, searchTerm);
	}, []);

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			childBundles: selectedProducts,
		}));
	}, [selectedProducts, setFormData]);

	// Load initial products data
	useEffect(() => {
		const loadInitialProducts = async () => {
			if (childBundles.length > 0) {
				try {
					// Загружаем данные о продуктах из начального списка
					const productIds = childBundles.map(
						(bundle) => bundle.childId
					);
					const promises = productIds.map((id) =>
						fetch(`/api/admin/product/${id}`).then((res) =>
							res.json()
						)
					);

					const products = await Promise.all(promises);

					// Обновляем кэш продуктов
					setProductsCache((prev) => {
						const newCache = { ...prev };
						products.forEach((product) => {
							newCache[product.id] = product;
						});
						return newCache;
					});

					// Устанавливаем выбранные продукты
					setSelectedProducts(childBundles);
				} catch (error) {
					console.error("Error loading initial products:", error);
				}
			}
		};

		loadInitialProducts();
	}, [childBundles]);

	// Handle search with debounce
	const handleSearchChange = (value: string) => {
		setSearchTerm(value);

		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		const timeout = setTimeout(() => {
			fetchProducts(1, value);
		}, 500);

		setSearchTimeout(timeout);
	};

	// Handle pagination
	const handlePageChange = (page: number) => {
		fetchProducts(page, searchTerm);
	};

	// Check if product is selected
	const isProductSelected = useCallback(
		(productId: number) => {
			return selectedProducts.some(
				(bundle) => bundle.childId === productId
			);
		},
		[selectedProducts]
	);

	// Toggle product selection
	const toggleProduct = (productId: number) => {
		if (isProductSelected(productId)) {
			setSelectedProducts((prev) =>
				prev.filter((bundle) => bundle.childId !== productId)
			);
		} else {
			setSelectedProducts((prev) => [
				...prev,
				{
					parentId: PARENT_ID,
					childId: productId,
					quantity: 1,
				},
			]);
		}
	};

	// Remove product from bundle
	const removeProduct = (productId: number) => {
		setSelectedProducts((prev) =>
			prev.filter((bundle) => bundle.childId !== productId)
		);
	};

	// Get product details by ID from cache
	const getProductById = useCallback(
		(id: number) => {
			return productsCache[id] || null;
		},
		[productsCache]
	);

	// Get product image URL
	const getProductImage = (product: Product) => {
		if (product.images?.length > 0) {
			return product.images[0].url;
		}
		return "/placeholder.svg?height=60&width=60";
	};

	const selectAllVisible = () => {
		const visibleProductIds = products.map((p) => p.id);
		const newSelections = visibleProductIds
			.filter((id) => !isProductSelected(id))
			.map((id) => ({
				parentId: PARENT_ID,
				childId: id,
				quantity: 1,
			}));

		setSelectedProducts((prev) => [...prev, ...newSelections]);
	};

	const deselectAllVisible = () => {
		const visibleProductIds = products.map((p) => p.id);
		setSelectedProducts((prev) =>
			prev.filter((bundle) => !visibleProductIds.includes(bundle.childId))
		);
	};

	// Update parent component when selectedProducts change
	// useEffect(() => {
	// 	if (selectedProducts.length > 0) {
	// 		setBundleProducts({
	// 			selectedProducts,
	// 		});
	// 	}
	// }, [selectedProducts, productsCache, setBundleProducts, getProductById]);

	const allVisibleSelected =
		products.length > 0 && products.every((p) => isProductSelected(p.id));

	return (
		<div className="p-6 w-full space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-bold mb-2">
						Собрать комплект
					</h1>
					<p className="text-muted-foreground">
						Выберите товары для создания комплекта. Используйте
						флажки, чтобы добавлять или удалять позиции.
					</p>
				</div>

				<div className="flex flex-col items-end gap-2">
					{/* <div className="text-sm text-muted-foreground">
						Total Weight: {totalBundleWeight}g
					</div>
					<div className="text-2xl font-bold text-green-600">
						{formatPrice(totalBundlePrice)}
					</div> */}
					{/* <Button
						type="button"
						onClick={() =>
							setFormData((prev) => ({
								...prev,
								childBundles: selectedProducts,
							}))
						}
						className="flex items-center gap-2"
						disabled={selectedProducts.length === 0}
					>
						<Plus className="h-4 w-4" />
						Сохранить изделия в комплект ({selectedProducts.length})
					</Button> */}
				</div>
			</div>

			{/* Selected Products Summary */}
			{selectedProducts.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ShoppingCart className="h-5 w-5" />
							Выбранные изделия ({selectedProducts.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{selectedProducts.map((bundle) => {
								const product = getProductById(bundle.childId);
								if (!product) return null;

								return (
									<Badge
										key={bundle.childId}
										variant="secondary"
										className="flex items-center gap-2 px-3 py-1"
									>
										<span className="truncate max-w-[200px]">
											{product.name}
										</span>
										{/* <span className="text-green-600 font-medium">
											{formatPrice(product.price)}
										</span> */}
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
											onClick={() =>
												removeProduct(product.id)
											}
										>
											<X className="h-3 w-3" />
										</Button>
									</Badge>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			<Separator />

			{/* Search and Controls */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Search products by name, SKU, or description..."
						value={searchTerm}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="pl-10"
					/>
					{loading && (
						<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
					)}
				</div>

				{products.length > 0 && (
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={
								allVisibleSelected
									? deselectAllVisible
									: selectAllVisible
							}
						>
							{allVisibleSelected ? "Убрать все" : "Выбрать все"}
						</Button>
						<span className="text-sm text-muted-foreground">
							{selectedProducts.length} выбрано
						</span>
					</div>
				)}
			</div>

			{/* Products Table */}
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-12">
								<Checkbox
									checked={allVisibleSelected}
									onCheckedChange={
										allVisibleSelected
											? deselectAllVisible
											: selectAllVisible
									}
									//   indeterminate={someVisibleSelected && !allVisibleSelected}
								/>
							</TableHead>
							<TableHead className="w-16">Картинка</TableHead>
							<TableHead>Изделие</TableHead>
							<TableHead>Категория</TableHead>
							<TableHead>SKU</TableHead>
							{/* <TableHead>Weight</TableHead>
							<TableHead className="text-right">Price</TableHead> */}
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading && products.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-8"
								>
									<div className="flex items-center justify-center gap-2">
										<Loader2 className="h-5 w-5 animate-spin" />
										<span>Загрузка изделий...</span>
									</div>
								</TableCell>
							</TableRow>
						) : products.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-8 text-muted-foreground"
								>
									Товары не найдены. Попробуйте изменить
									параметры поиска.
								</TableCell>
							</TableRow>
						) : (
							products.map((product) => {
								if (editingElemntId) {
									if (product.id == +editingElemntId)
										return null;
								}
								return (
									<TableRow
										key={product.id}
										className={`cursor-pointer hover:bg-muted/50 ${
											isProductSelected(product.id)
												? "bg-muted/30"
												: ""
										}`}
										onClick={() =>
											toggleProduct(product.id)
										}
									>
										<TableCell
											onClick={(e) => e.stopPropagation()}
										>
											<Checkbox
												checked={isProductSelected(
													product.id
												)}
												onCheckedChange={() =>
													toggleProduct(product.id)
												}
											/>
										</TableCell>
										<TableCell>
											<div className="h-12 w-12 rounded-md overflow-hidden">
												<img
													src={
														getProductImage(
															product
														) || "/placeholder.svg"
													}
													alt={product.name}
													className="h-full w-full object-cover"
												/>
											</div>
										</TableCell>
										<TableCell>
											<div>
												<div className="font-medium">
													{product.name}
												</div>
												{product.description && (
													<div className="text-sm text-muted-foreground truncate max-w-[300px]">
														{product.description}
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className="text-xs"
											>
												{product.category.name}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant="secondary"
												className="text-xs"
											>
												{product.sku}
											</Badge>
										</TableCell>
										{/* <TableCell className="text-sm">
										{product.weight}g
									</TableCell>
									<TableCell className="text-right">
										<span className="font-semibold text-green-600">
											{formatPrice(product.price)}
										</span>
									</TableCell> */}
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</Card>

			{/* Pagination */}
			{pagination.pages > 1 && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						Showing {(pagination.page - 1) * pagination.limit + 1}{" "}
						to{" "}
						{Math.min(
							pagination.page * pagination.limit,
							pagination.total
						)}{" "}
						of {pagination.total} products
					</div>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								handlePageChange(pagination.page - 1)
							}
							disabled={pagination.page === 1 || loading}
						>
							<ChevronLeft className="h-4 w-4" />
							Previous
						</Button>
						<div className="flex items-center gap-1">
							{Array.from(
								{ length: Math.min(5, pagination.pages) },
								(_, i) => {
									const pageNum = i + 1;
									return (
										<Button
											type="button"
											key={pageNum}
											variant={
												pagination.page === pageNum
													? "default"
													: "outline"
											}
											size="sm"
											onClick={() =>
												handlePageChange(pageNum)
											}
											disabled={loading}
										>
											{pageNum}
										</Button>
									);
								}
							)}
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								handlePageChange(pagination.page + 1)
							}
							disabled={
								pagination.page === pagination.pages || loading
							}
						>
							Next
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Debug Output */}
			{/* {selectedProducts.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							Bundle Output (ProductBundle[])
						</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
							{JSON.stringify(selectedProducts, null, 2)}
						</pre>
					</CardContent>
				</Card>
			)} */}
		</div>
	);
}
