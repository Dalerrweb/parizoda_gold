"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, Edit, Package } from "lucide-react";
import Link from "next/link";
import { Product } from "@/app/types";
import { formatDate } from "@/lib/utils";
import ProductPreviewModal from "@/components/custom/product-view-modal";

interface ProductItemProps {
	product: Required<Product>;
}

const ProductItemRow: React.FC<ProductItemProps> = ({ product }) => {
	return (
		<TableRow>
			<TableCell>
				<div className="flex items-center space-x-3">
					<div className="h-12 w-12 rounded-lg border overflow-hidden bg-muted">
						{product.images.length > 0 ? (
							<img
								src={
									product.images[0].url || "/placeholder.svg"
								}
								alt={product.name}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="h-full w-full flex items-center justify-center">
								<Package className="h-6 w-6 text-muted-foreground" />
							</div>
						)}
					</div>
					<div className="max-w-[200px]">
						<div className="font-medium truncate">
							{product.name}
						</div>
						<div className="text-sm text-muted-foreground truncate">
							{product.description || "No description"}
						</div>
						<div className="text-xs text-muted-foreground">
							ID: {product.id}
						</div>
					</div>
				</div>
			</TableCell>
			<TableCell>
				<Badge variant="outline">{product.category.name}</Badge>
			</TableCell>

			<TableCell>
				<div className="flex items-center space-x-2">
					<span className="font-medium">{product.images.length}</span>
					<span className="text-muted-foreground text-sm">
						{product.images.length === 1 ? "картина" : "картинок"}
					</span>
				</div>
			</TableCell>
			{/* <TableCell>
				<div className="flex items-center space-x-2">
					<span className="font-medium">{product.orders.length}</span>
					{product.orders.length > 0 && (
						<Badge variant="default" className="text-xs">
							Selling
						</Badge>
					)}
				</div>
			</TableCell> */}
			<TableCell>
				<div className="text-sm">{formatDate(product.updatedAt)}</div>
			</TableCell>
			<TableCell className="text-right">
				<div className="flex items-center gap-2">
					<ProductPreviewModal product={product} />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<Link href={`/admin/products/${product.id}/edit`}>
								<DropdownMenuItem>
									<Edit className="mr-2 h-4 w-4" />
									Изменить товар
								</DropdownMenuItem>
							</Link>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</TableCell>
		</TableRow>
	);
};

export default ProductItemRow;
