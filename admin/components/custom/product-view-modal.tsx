"use client";

import type React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Eye,
	Package,
	Tag,
	Calendar,
	ShoppingCart,
	Layers,
	Ruler,
	ImageIcon,
} from "lucide-react";
import { type Product, ProductType } from "@/app/types";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { usePrice } from "@/context/PriceContext";

interface ProductPreviewModalProps {
	product: Required<Product>;
	trigger?: React.ReactNode;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
	product,
	trigger,
}) => {
	const defaultTrigger = (
		<Button variant="ghost" size="sm">
			<Eye className="h-4 w-4 mr-2" />
			Preview
		</Button>
	);

	const [selectedSize, setSelectedSize] = useState<number>(0); // Index of selected size
	const price = usePrice();

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Package className="h-5 w-5" />
						Product Preview
					</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[calc(90vh-120px)]">
					<div className="space-y-6 p-1">
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Tag className="h-4 w-4" />
									Basic Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											ID
										</label>
										<p className="text-sm">{product.id}</p>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											SKU
										</label>
										<p className="text-sm font-mono bg-muted px-2 py-1 rounded">
											{product.sku}
										</p>
									</div>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Name
									</label>
									<p className="text-lg font-semibold">
										{product.name}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Description
									</label>
									<p className="text-sm">
										{product.description ||
											"No description provided"}
									</p>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Type
										</label>
										<div className="mt-1">
											<Badge
												variant={
													product.type ===
													ProductType.BUNDLE
														? "default"
														: "secondary"
												}
											>
												{product.type}
											</Badge>
										</div>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Markup
										</label>
										<p className="text-sm font-medium">
											{product.markup}%
										</p>
									</div>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Current Price (Selected Size)
									</label>
									<p className="text-lg font-bold text-primary">
										{/* {price &&
										product.sizes &&
										product.sizes[selectedSize]
											? `$${(
													price.pricePerGram *
													product.sizes[selectedSize]
														.weight *
													(1 + product.markup / 100)
											  ).toFixed(2)}`
											: "Select a size to see price"} */}
									</p>
									{price && (
										<p className="text-xs text-muted-foreground">
											Base: ${price.pricePerGram}/g +{" "}
											{product.markup}% markup
										</p>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Category Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Layers className="h-4 w-4" />
									Category
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Category ID
										</label>
										<p className="text-sm">
											{product.categoryId}
										</p>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Category Name
										</label>
										<Badge variant="outline">
											{product.category?.name ||
												"Unknown Category"}
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Images */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<ImageIcon className="h-4 w-4" />
									Images ({product.images?.length || 0})
								</CardTitle>
							</CardHeader>
							<CardContent>
								{product.images && product.images.length > 0 ? (
									<div className="grid grid-cols-4 gap-4">
										{product.images.map((image, index) => (
											<div
												key={index}
												className="aspect-square rounded-lg border overflow-hidden bg-muted"
											>
												<img
													src={
														image.url ||
														"/placeholder.svg"
													}
													alt={`${
														product.name
													} image ${index + 1}`}
													className="h-full w-full object-cover"
												/>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-8 text-muted-foreground">
										<ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
										<p>No images available</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Sizes */}
						{product.sizes && product.sizes.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Ruler className="h-4 w-4" />
										Sizes ({product.sizes.length})
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{product.sizes.map((size, index) => {
											{
												/* TODO: показать правильную цену продукта здесь */
											}

											// Calculate price for this size
											// const sizePrice =
											// 	price && size.weight
											// 		? price.pricePerGram *
											// 		  size.weight *
											// 		  (1 + product.markup / 100)
											// 		: 0;

											const isSelected =
												selectedSize === index;

											return (
												<div
													key={size.id || index}
													className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
														isSelected
															? "border-primary bg-primary/5"
															: "hover:border-primary/50"
													}`}
													onClick={() =>
														setSelectedSize(index)
													}
												>
													<div className="flex items-center gap-4">
														<Badge
															variant={
																isSelected
																	? "default"
																	: "outline"
															}
														>
															{size.size}
														</Badge>
														<div className="text-sm">
															<span className="font-medium">
																Qty:
															</span>{" "}
															{size.quantity}
														</div>
														<div className="text-sm">
															<span className="font-medium">
																Weight:
															</span>{" "}
															{size.weight}g
														</div>
													</div>
													<div className="text-right">
														{/* TODO: показать правильную цену продукта здесь */}

														{/* {price &&
														sizePrice > 0 ? (
															<div className="text-lg font-bold text-primary">
																$
																{sizePrice.toFixed(
																	2
																)}
															</div>
														) : (
															<div className="text-sm text-muted-foreground">
																Price not
																available
															</div>
														)} */}
													</div>
												</div>
											);
										})}
									</div>

									{/* Selected Size Summary */}
									{product.sizes[selectedSize] && (
										<div className="mt-4 p-4 bg-muted rounded-lg">
											<h4 className="font-medium mb-2">
												Selected Size Details
											</h4>
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<span className="text-muted-foreground">
														Size:
													</span>
													<span className="ml-2 font-medium">
														{
															product.sizes[
																selectedSize
															].size
														}
													</span>
												</div>
												<div>
													<span className="text-muted-foreground">
														Weight:
													</span>
													<span className="ml-2 font-medium">
														{
															product.sizes[
																selectedSize
															].weight
														}
														g
													</span>
												</div>
												<div>
													<span className="text-muted-foreground">
														Quantity Available:
													</span>
													<span className="ml-2 font-medium">
														{
															product.sizes[
																selectedSize
															].quantity
														}
													</span>
												</div>
												<div>
													<span className="text-muted-foreground">
														Final Price:
													</span>
													<span className="ml-2 font-bold text-primary">
														{/* TODO: показать правильную цену продукта здесь */}
														{/* {price &&
														product.sizes[
															selectedSize
														].weight
															? `$${(
																	price.pricePerGram *
																	product
																		.sizes[
																		selectedSize
																	].weight *
																	(1 +
																		product.markup /
																			100)
															  ).toFixed(2)}`
															: "Not available"} */}
													</span>
												</div>
											</div>
											{price && (
												<div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
													<div>
														Base price: $
														{price.pricePerGram}/g
													</div>
													<div>
														Markup: {product.markup}
														%
													</div>
													<div>
														Calculation: $
														{price.pricePerGram} ×{" "}
														{
															product.sizes[
																selectedSize
															].weight
														}
														g ×{" "}
														{(
															1 +
															product.markup / 100
														).toFixed(2)}{" "}
														= $
														{/* TODO: показать правильную цену продукта здесь */}
														{/* {(
															price.pricePerGram *
															product.sizes[
																selectedSize
															].weight *
															(1 +
																product.markup /
																	100)
														).toFixed(2)} */}
													</div>
												</div>
											)}
										</div>
									)}
								</CardContent>
							</Card>
						)}

						{/* Bundle Relationships */}
						{((product.parentBundle &&
							product.parentBundle.length > 0) ||
							(product.childBundles &&
								product.childBundles.length > 0)) && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Package className="h-4 w-4" />
										Bundle Relationships
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{product.parentBundle &&
										product.parentBundle.length > 0 && (
											<div>
												<label className="text-sm font-medium text-muted-foreground">
													Part of Bundles (
													{
														product.parentBundle
															.length
													}
													)
												</label>
												<div className="mt-2 flex flex-wrap gap-2">
													{product.parentBundle.map(
														(parent, index) => (
															<Badge
																key={index}
																variant="secondary"
															>
																{parent.name ||
																	`Bundle ${
																		index +
																		1
																	}`}
															</Badge>
														)
													)}
												</div>
											</div>
										)}
									{product.childBundles &&
										product.childBundles.length > 0 && (
											<div>
												<label className="text-sm font-medium text-muted-foreground">
													Contains Products (
													{
														product.childBundles
															.length
													}
													)
												</label>
												<div className="mt-2 flex flex-wrap gap-2">
													{product.childBundles.map(
														(child, index) => (
															<Badge
																key={index}
																variant="outline"
															>
																{child.name ||
																	`Product ${
																		index +
																		1
																	}`}
															</Badge>
														)
													)}
												</div>
											</div>
										)}
								</CardContent>
							</Card>
						)}

						{/* Orders */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<ShoppingCart className="h-4 w-4" />
									Orders ({product.orders?.length || 0})
								</CardTitle>
							</CardHeader>
							<CardContent>
								{product.orders && product.orders.length > 0 ? (
									<div className="space-y-2">
										<div className="flex items-center gap-4">
											<div className="text-sm">
												<span className="font-medium">
													Total Orders:
												</span>{" "}
												{product.orders.length}
											</div>
											<Badge
												variant="default"
												className="text-xs"
											>
												Active Product
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											This product has been ordered{" "}
											{product.orders.length} time
											{product.orders.length !== 1
												? "s"
												: ""}
											.
										</p>
									</div>
								) : (
									<div className="text-center py-4 text-muted-foreground">
										<ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
										<p className="text-sm">No orders yet</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Timestamps */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									Timestamps
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Created At
										</label>
										<p className="text-sm">
											{product.createdAt
												? formatDate(product.createdAt)
												: "Not available"}
										</p>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Last Updated
										</label>
										<p className="text-sm">
											{product.updatedAt
												? formatDate(product.updatedAt)
												: "Not available"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default ProductPreviewModal;
