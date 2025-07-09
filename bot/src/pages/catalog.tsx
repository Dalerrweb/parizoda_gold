"use client";

import { ProductCard } from "@/components/custom/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetProductsQuery } from "@/services/api";
import { ChevronLeft, AlertCircle } from "lucide-react";
import type React from "react";
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";

type catalogProps = {};

const Catalog: React.FC<catalogProps> = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { category } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = Number.parseInt(searchParams.get("page") || "1", 10);

	const { data, error, isLoading } = useGetProductsQuery({
		categoryId: Number(category),
		page: currentPage,
	});

	const state = location;

	const handlePageChange = (page: number) => {
		setSearchParams({ page: page.toString() });
	};

	// Generate pagination items
	const generatePaginationItems = () => {
		if (!data?.pagination) return [];

		const { page, pages } = data.pagination;
		const items = [];

		items.push(1);

		if (page > 3) {
			items.push("ellipsis-start");
		}

		for (
			let i = Math.max(2, page - 1);
			i <= Math.min(pages - 1, page + 1);
			i++
		) {
			if (!items.includes(i)) {
				items.push(i);
			}
		}

		if (page < pages - 2) {
			items.push("ellipsis-end");
		}

		if (pages > 1 && !items.includes(pages)) {
			items.push(pages);
		}

		return items;
	};

	// Loading skeleton component
	const ProductSkeleton = () => (
		<div className="space-y-2">
			<Skeleton className="aspect-square w-full rounded-lg" />
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
		</div>
	);

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<div className="flex items-center p-4 border-b">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate(-1)}
						className="mr-2"
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<h1 className="text-lg font-semibold">
						{state.state?.title || "All Products"}
					</h1>
				</div>

				<div className="p-4">
					{/* Error State */}
					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								Failed to load products. Please try again later.
							</AlertDescription>
						</Alert>
					)}

					{/* Loading State */}
					{isLoading && (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
							{Array.from({ length: 8 }).map((_, index) => (
								<ProductSkeleton key={index} />
							))}
						</div>
					)}

					{/* Products Grid */}
					{!isLoading && !error && data?.products && (
						<>
							{data.products.length > 0 ? (
								<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
									{data.products.map((product) => (
										<ProductCard
											key={product.id}
											{...product}
										/>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<p className="text-muted-foreground">
										No products found in this category.
									</p>
								</div>
							)}

							{/* Pagination */}
							{data.pagination && data.pagination.pages > 1 && (
								<div className="mt-8 flex justify-center">
									<Pagination>
										<PaginationContent>
											{/* Previous Button */}
											<PaginationItem>
												<PaginationPrevious
													onClick={() =>
														handlePageChange(
															Math.max(
																1,
																currentPage - 1
															)
														)
													}
													className={
														currentPage <= 1
															? "pointer-events-none opacity-50"
															: "cursor-pointer"
													}
												/>
											</PaginationItem>

											{/* Page Numbers */}
											{generatePaginationItems().map(
												(item, index) => (
													<PaginationItem key={index}>
														{item ===
															"ellipsis-start" ||
														item ===
															"ellipsis-end" ? (
															<PaginationEllipsis />
														) : (
															<PaginationLink
																onClick={() =>
																	handlePageChange(
																		item as number
																	)
																}
																isActive={
																	currentPage ===
																	item
																}
																className="cursor-pointer"
															>
																{item}
															</PaginationLink>
														)}
													</PaginationItem>
												)
											)}

											{/* Next Button */}
											<PaginationItem>
												<PaginationNext
													onClick={() =>
														handlePageChange(
															Math.min(
																data.pagination
																	.pages,
																currentPage + 1
															)
														)
													}
													className={
														currentPage >=
														data.pagination.pages
															? "pointer-events-none opacity-50"
															: "cursor-pointer"
													}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							)}
						</>
					)}
				</div>
			</main>
			<br />
		</div>
	);
};

export default Catalog;
