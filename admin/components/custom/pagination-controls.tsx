"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	totalAmount: number;
	itemsPerPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	searchQuery?: string;
	categoryFilter?: string;
	pathName: string;
}

export function PaginationControls({
	currentPage,
	totalPages,
	totalAmount,
	itemsPerPage,
	hasNextPage,
	hasPrevPage,
	searchQuery,
	categoryFilter,
	pathName,
}: PaginationControlsProps) {
	const router = useRouter();

	const buildUrl = (page?: number, limit?: number) => {
		const params = new URLSearchParams();

		if (searchQuery) params.set("search", searchQuery);
		if (categoryFilter && categoryFilter !== "all")
			params.set("category", categoryFilter);
		if (page && page > 1) params.set("page", page.toString());
		if (limit && limit !== 10) params.set("limit", limit.toString());

		const queryString = params.toString();
		return `/admin/${pathName}${queryString ? `?${queryString}` : ""}`;
	};

	const handleItemsPerPageChange = (value: string) => {
		const newLimit = Number.parseInt(value);
		router.push(buildUrl(1, newLimit)); // Reset to page 1 when changing items per page
	};

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
			<div className="text-sm text-muted-foreground">
				Показано {(currentPage - 1) * itemsPerPage + 1}-
				{Math.min(currentPage * itemsPerPage, totalAmount)} из{" "}
				{totalAmount} товаров
			</div>

			<div className="flex items-center space-x-4">
				{/* Items per page selector */}
				<div className="flex items-center space-x-2">
					<span className="text-sm text-muted-foreground">
						Показать:
					</span>
					<Select
						value={itemsPerPage.toString()}
						onValueChange={handleItemsPerPageChange}
					>
						<SelectTrigger className="w-20">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="5">5</SelectItem>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="50">50</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Page info and navigation */}
				<div className="flex items-center space-x-2">
					<div className="text-sm text-muted-foreground">
						Страница {currentPage} из {totalPages}
					</div>

					<div className="flex space-x-1">
						<Link href={buildUrl(currentPage - 1, itemsPerPage)}>
							<Button
								variant="outline"
								size="sm"
								disabled={!hasPrevPage}
								className="disabled:opacity-50 bg-transparent"
							>
								<ChevronLeft className="h-4 w-4" />
								Пред
							</Button>
						</Link>

						<Link href={buildUrl(currentPage + 1, itemsPerPage)}>
							<Button
								variant="outline"
								size="sm"
								disabled={!hasNextPage}
								className="disabled:opacity-50 bg-transparent"
							>
								След
								<ChevronRight className="h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
