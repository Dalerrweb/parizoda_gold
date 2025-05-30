"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Category } from "@/app/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}

interface CategoryRowProps {
	category: Category;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category }) => {
	const router = useRouter();

	async function handleRemoveCategory() {
		try {
			const res = await fetch("/api/admin/category/" + category.id, {
				method: "DELETE",
			});

			if (!res.ok) {
				throw new Error("Failed to remove category");
			}

			toast.success(`Category "${category.name}" has been deleted.`);
			router.refresh();
		} catch (e) {
			toast.error("Failed to remove category", {
				description: "Please try again later.",
			});
		}
	}

	return (
		<TableRow key={category.id}>
			<TableCell>
				<div className="flex items-center space-x-3">
					<img
						src={category.imageUrl || "/placeholder.svg"}
						alt={category.name}
						className="h-12 w-12 rounded-lg object-cover border"
					/>
					<div>
						<div className="font-medium">{category.name}</div>
						<div className="text-sm text-muted-foreground">
							ID: {category.id}
						</div>
					</div>
				</div>
			</TableCell>
			<TableCell>
				<div className="flex items-center space-x-2">
					<span className="font-medium">
						{category.products.length}
					</span>
					<span className="text-muted-foreground text-sm">
						products
					</span>
				</div>
			</TableCell>
			<TableCell>
				{category.products.length > 0 ? (
					<Badge variant="default">Active</Badge>
				) : (
					<Badge variant="secondary">Empty</Badge>
				)}
			</TableCell>
			<TableCell>
				<div className="text-sm">{formatDate(category.createdAt)}</div>
			</TableCell>
			<TableCell className="text-right">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Eye className="mr-2 h-4 w-4" />
							View Products
						</DropdownMenuItem>
						<Link href={`/admin/categories/edit/${category.id}`}>
							<DropdownMenuItem>
								<Edit className="mr-2 h-4 w-4" />
								Edit Category
							</DropdownMenuItem>
						</Link>
						<DropdownMenuItem
							className="text-destructive"
							onClick={handleRemoveCategory}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete Category
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
};

export default CategoryRow;
