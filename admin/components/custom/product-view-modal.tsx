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
import { formatDate, formatPrice } from "@/lib/utils";
import { useMemo, useState } from "react";
import { usePrice } from "@/context/PriceContext";

interface ProductPreviewModalProps {
	product: Required<Product>;
	trigger?: React.ReactNode;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
	product,
}) => {
	const { calculate } = usePrice();

	const calculatedPrice = useMemo(() => {
		let price = 0;
		if (product.type !== ProductType.BUNDLE) {
			return calculate({
				weight: product.sizes?.[0]?.weight || 0,
				markup: product.markup,
			});
		}
		for (let item of product.parentBundle) {
			price += calculate({
				weight: item.child.sizes?.[0]?.weight || 0,
				markup: item.child.markup,
			});
		}

		return price;
	}, []);

	const defaultTrigger = (
		<Button variant="ghost" size="sm">
			<Eye className="h-4 w-4 mr-2" />
			Просмотр
		</Button>
	);

	return (
		<Dialog>
			<DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
			<DialogContent className="max-w-5xl max-h-[90vh]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Package className="h-5 w-5" />
						Просмотр товара
					</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[calc(90vh-120px)]">
					<div className="space-y-6 p-1">
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Tag className="h-4 w-4" />
									Информация о продукте
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
										Название
									</label>
									<p className="text-lg font-semibold">
										{product.name}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Описание
									</label>
									<p className="text-sm">
										{product.description ||
											"No description provided"}
									</p>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Тип
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
												{product.type ===
												ProductType.BUNDLE
													? "Комплект"
													: "Изделие"}
											</Badge>
										</div>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Наценка
										</label>
										<p className="text-sm font-medium">
											{product.markup}%
										</p>
									</div>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Цена на сегондя (Первый размер по
										умолчанию)
									</label>
									<p className="text-lg font-bold text-primary">
										{formatPrice(calculatedPrice)}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Category Information */}
						{/* <Card>
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
						</Card> */}

						{/* Sizes */}
						{product.sizes && product.sizes.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Ruler className="h-4 w-4" />
										Размеры ({product.sizes.length})
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{product.sizes.map((size) => {
											return (
												<div
													key={size.id}
													className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors"
												>
													<div className="flex items-center gap-4">
														<Badge className="bg-green-700">
															{size.size}
														</Badge>
														<div className="text-sm">
															<span className="font-medium">
																Кол:
															</span>{" "}
															{size.quantity}
														</div>
														<div className="text-sm">
															<span className="font-medium">
																Вес:
															</span>{" "}
															{size.weight} г
														</div>
														<div className="text-sm">
															<span className="font-medium">
																Цена:
															</span>{" "}
															<Badge
																variant="default"
																className="bg-green-700"
															>
																{formatPrice(
																	calculate({
																		weight: size.weight,
																		markup: product.markup,
																	})
																)}
															</Badge>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Images */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<ImageIcon className="h-4 w-4" />
									Картинки ({product.images?.length || 0})
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

						{/* Bundle Relationships */}
						{product.parentBundle &&
							product.parentBundle.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Package className="h-4 w-4" />
											Состовляющие комплекта
										</CardTitle>
									</CardHeader>
									<CardContent>
										{product.parentBundle &&
											product.parentBundle.length > 0 && (
												<div className="space-y-3">
													{product.parentBundle.map(
														({ child }) => (
															<BandleItem
																key={child.id}
																child={child}
															/>
														)
													)}
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

function BandleItem({ child }: { child: any }) {
	const [selectedSize, setSelectedSize] = useState(child.sizes[0] || null);
	const { calculate } = usePrice();

	return (
		<div>
			<div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors">
				<div className="flex items-center gap-4 justify-between w-full">
					<div className="flex items-center gap-2">
						<Badge className="bg-green-700">{child.sku}</Badge>
						<div className="text-sm truncate max-w-[5ch]">
							<span className="font-medium">{child.name}</span>
						</div>
						<div className="text-sm ml-3">
							<span className="font-medium">
								Вес: {selectedSize.weight} г
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2 text-sm">
						<span className="font-medium">Цена:</span>{" "}
						<Badge variant="default" className="bg-green-700">
							{formatPrice(
								calculate({
									weight: selectedSize.weight || 0,
									markup: child.markup,
								})
							)}{" "}
						</Badge>
						<span>{child.markup}%</span>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2 mt-2">
				<Badge variant="outline">Размеры:</Badge>
				{child.sizes.map((size: any) => {
					return (
						<Badge
							key={size.id}
							variant={
								size.id === selectedSize.id
									? "default"
									: "secondary"
							}
							className="cursor-pointer"
							onClick={() => setSelectedSize(size)}
						>
							{size.size}{" "}
						</Badge>
					);
				})}
			</div>
		</div>
	);
}
