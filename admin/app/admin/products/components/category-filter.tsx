"use client";

import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Category } from "@/app/types";

interface CategoryFilterProps {
	categories: Omit<Category, "products">[];
	currentCategory: string;
	searchQuery?: string;
	currentPage: number;
	itemsPerPage: number;
}

export function CategoryFilter({
	categories,
	currentCategory,
	searchQuery,
	itemsPerPage,
}: CategoryFilterProps) {
	const router = useRouter();

	const handleCategoryChange = (value: string) => {
		const params = new URLSearchParams();

		if (searchQuery) {
			params.set("search", searchQuery);
		}

		if (value !== "all") {
			params.set("category", value);
		}

		if (itemsPerPage !== 10) {
			params.set("limit", itemsPerPage.toString());
		}

		const queryString = params.toString();
		router.push(`/admin/products${queryString ? `?${queryString}` : ""}`);
	};

	return (
		<div className="w-full sm:w-48">
			<Select
				value={currentCategory}
				onValueChange={handleCategoryChange}
			>
				<SelectTrigger>
					<SelectValue placeholder="Все категории" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Все категории</SelectItem>
					{categories.map((category) => (
						<SelectItem
							key={category.id}
							value={category.id.toString()}
						>
							{category.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
