"use client";

import { useState, useEffect } from "react";
import { Search, X, ShoppingCart, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";

interface ProductImage {
	id: number;
	url: string;
	alt?: string;
}

interface ProductCategory {
	id: number;
	name: string;
}

interface ProductSize {
	id: number;
	name: string;
	price: number;
}

interface Product {
	id: number;
	sku: string;
	name: string;
	description?: string;
	price: number;
	categoryId: number;
	type: string;
	weight: number;
	category: ProductCategory;
	images: ProductImage[];
	sizes: ProductSize[];
	createdAt: string;
}

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

const ITEMS_PER_PAGE = 5;
const PARENT_ID = 1; // Assuming bundle parent ID

export default function ProductBundle({
	setBundleProducts,
}: {
	setBundleProducts: (arr: any) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedProducts, setSelectedProducts] = useState<ProductBundle[]>(
		[]
	);
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

	// Fetch products from API
	const fetchProducts = async (page = 1, search = "") => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: ITEMS_PER_PAGE.toString(),
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
			setPagination(data.pagination);
			setCurrentPage(page);
		} catch (error) {
			console.error("Error fetching products:", error);
			toast.error("Failed to fetch products. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Initial load
	useEffect(() => {
		if (isOpen) {
			fetchProducts(1, searchTerm);
		}
	}, [isOpen]);

	// Handle search with debounce
	const handleSearchChange = (value: string) => {
		setSearchTerm(value);

		// Clear existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Set new timeout for debounced search
		const timeout = setTimeout(() => {
			fetchProducts(1, value);
		}, 500);

		setSearchTimeout(timeout);
	};

	// Handle pagination
	const handlePageChange = (page: number) => {
		fetchProducts(page, searchTerm);
	};

	// Check if product is already added
	const isProductAdded = (productId: number) => {
		return selectedProducts.some((bundle) => bundle.childId === productId);
	};

	// Add product to bundle
	const addProduct = (productId: number) => {
		if (!isProductAdded(productId)) {
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

	// Get product details by ID
	const getProductById = (id: number) => {
		return products.find((product) => product.id === id);
	};

	// Get product image URL
	const getProductImage = (product: Product) => {
		if (product.images && product.images.length > 0) {
			return product.images[0].url;
		}
		return "/placeholder.svg?height=80&width=80";
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(price);
	};

	const totalBundlePrice = selectedProducts.reduce((total, bundle) => {
		const product = getProductById(bundle.childId);
		return total + (product?.price || 0);
	}, 0);

	const totalBundleWeight = selectedProducts.reduce((total, bundle) => {
		const product = getProductById(bundle.childId);
		return total + (product?.weight || 0);
	}, 0);

	return (
		<div className="p-4 w-full">
			<div className="flex items-start justify-between w-full">
				<div className="mb-8">
					<h1 className="text-2xl font-bold mb-4">
						Product Bundle Manager
					</h1>
					<Button
						type="button"
						onClick={() => setIsOpen(true)}
						className="flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Product
					</Button>
				</div>
				{/* {selectedProducts.length > 0 && ( */}
				<div className="flex flex-col items-end gap-2">
					<div className="text-lg text-gray-500">
						Total Weight: {totalBundleWeight} grams
					</div>
					<div className="text-lg font-bold text-green-600">
						Total: {formatPrice(totalBundlePrice)}
					</div>
					<Button
						type="button"
						onClick={() =>
							setBundleProducts({
								selectedProducts,
								totalBundlePrice,
								totalBundleWeight,
							})
						}
						className="flex items-center gap-2"
						variant="outline"
					>
						<Plus className="h-4 w-4" />
						Save Bundle
					</Button>
				</div>
				{/* )} */}
			</div>

			{/* Selected Products Display */}
			{selectedProducts.length > 0 && (
				<div className="mb-8">
					<div className="flex items-start justify-between mb-4">
						<h2 className="text-xl font-semibold flex items-center gap-2">
							<ShoppingCart className="h-5 w-5" />
							Bundle Products ({selectedProducts.length})
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{selectedProducts.map((bundle) => {
							const product = getProductById(bundle.childId);
							if (!product) return null;

							return (
								<Card
									key={bundle.childId}
									className="relative group hover:shadow-md transition-shadow"
								>
									<CardContent className="p-4">
										<Button
											variant="ghost"
											size="sm"
											className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={() =>
												removeProduct(product.id)
											}
										>
											<X className="h-3 w-3" />
										</Button>
										<div className="flex items-start gap-3">
											<div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
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
											<div className="flex-1 min-w-0">
												<h3 className="font-medium text-sm leading-tight mb-1 truncate">
													{product.name}
												</h3>
												<div className="flex flex-col gap-1 mb-2">
													<Badge
														variant="secondary"
														className="text-xs w-fit"
													>
														{product.sku}
													</Badge>
													<Badge
														variant="outline"
														className="text-xs w-fit"
													>
														{product.category.name}
													</Badge>
												</div>
												<div className="text-lg font-bold text-green-600">
													{formatPrice(product.price)}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			)}

			{/* Side Panel */}
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent className="md:w-[70vw] w-[100vw] sm:max-w-none px-4">
					<SheetHeader>
						<SheetTitle>Add Products to Bundle</SheetTitle>
						<SheetDescription>
							Search and select products to add to your bundle
						</SheetDescription>
					</SheetHeader>

					<div className="mt-6 space-y-4">
						{/* Search */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search products by name, SKU, or description..."
								value={searchTerm}
								onChange={(e) =>
									handleSearchChange(e.target.value)
								}
								className="pl-10"
							/>
							{loading && (
								<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
							)}
						</div>

						{/* Product List */}
						<div className="space-y-3">
							{loading && products.length === 0 ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="h-6 w-6 animate-spin" />
									<span className="ml-2">
										Loading products...
									</span>
								</div>
							) : products.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									No products found. Try adjusting your
									search.
								</div>
							) : (
								products.map((product) => (
									<Card key={product.id} className="p-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
													<img
														src={
															getProductImage(
																product
															) ||
															"/placeholder.svg"
														}
														alt={product.name}
														className="h-full w-full object-cover"
													/>
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="font-medium truncate">
														{product.name}
													</h3>
													<div className="flex items-center gap-2 mt-1 flex-wrap">
														<Badge
															variant="outline"
															className="text-xs"
														>
															{product.sku}
														</Badge>
														<Badge
															variant="secondary"
															className="text-xs"
														>
															{
																product.category
																	.name
															}
														</Badge>
														<span className="text-lg font-semibold text-green-600">
															{formatPrice(
																product.price
															)}
														</span>
													</div>
													{product.description && (
														<p className="text-sm text-gray-600 mt-1 truncate">
															{
																product.description
															}
														</p>
													)}
												</div>
											</div>
											<Button
												size="sm"
												onClick={() =>
													addProduct(product.id)
												}
												disabled={isProductAdded(
													product.id
												)}
												className="ml-4"
											>
												{isProductAdded(product.id)
													? "Added"
													: "Add"}
											</Button>
										</div>
									</Card>
								))
							)}
						</div>

						{/* Pagination */}
						{pagination.pages > 1 && (
							<div className="flex items-center justify-between pt-4">
								<div className="text-sm text-gray-600">
									Page {pagination.page} of {pagination.pages}{" "}
									({pagination.total} products)
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(
												pagination.page - 1
											)
										}
										disabled={
											pagination.page === 1 || loading
										}
									>
										Previous
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(
												pagination.page + 1
											)
										}
										disabled={
											pagination.page ===
												pagination.pages || loading
										}
									>
										Next
									</Button>
								</div>
							</div>
						)}
					</div>
				</SheetContent>
			</Sheet>

			{/* Debug Output
			{selectedProducts.length > 0 && (
				<div className="mt-8 p-4 bg-gray-50 rounded-lg">
					<h3 className="font-medium mb-2">
						Bundle Output (ProductBundle[]):
					</h3>
					<pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
						{JSON.stringify(selectedProducts, null, 2)}
					</pre>
				</div>
			)} */}
		</div>
	);
}
