"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/data";
import Slider from "./product-page/slider";
import { Product } from "@/types";

interface ProductDetailsProps {
	product: Product;
	onAddToCart?: (
		productId: number,
		quantity: number,
		selectedSize?: string
	) => void;
	onImageChange?: (imageIndex: number) => void;
	className?: string;
}

function ProductDetails({
	product,
	onAddToCart,
	className,
}: ProductDetailsProps) {
	const [quantity, setQuantity] = useState(1);

	const [selectedSize, setSelectedSize] = useState<string | null>(
		product.sizes.length > 0 ? product.sizes[0].value : null
	);
	const navigate = useNavigate();

	console.log(product);

	const incrementQuantity = (): void => {
		setQuantity((prev) => prev + 1);
	};

	const decrementQuantity = (): void => {
		setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
	};

	const handleAddToCart = (): void => {
		if (onAddToCart) {
			onAddToCart(product.id, quantity, selectedSize || undefined);
		} else {
			// Fallback behavior
			console.log(`Added ${quantity} of product ${product.id} to cart`);
			alert(`Added ${quantity} of ${product.name} to cart`);
		}
	};

	return (
		<div className={cn("container mx-auto px-4 pb-8", className)}>
			<div className="flex items-center py-4 border-b">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate(-1)}
					className="mr-2"
					aria-label="Go back"
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-lg font-semibold truncate">
					{product.name}
				</h1>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Product Images */}
				<Slider product={product} />

				{/* Product Details */}
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							{product.name}
						</h1>
						<p className="mt-4 text-2xl font-semibold text-primary">
							{formatPrice(product.price)}
						</p>
					</div>

					{product.sizes.length > 0 && (
						<div className="space-y-2">
							<h2 className="text-xl font-semibold">Размеры</h2>
							<div className="flex flex-wrap gap-2">
								{product.sizes.map((size) => (
									<Button
										key={size.id}
										variant={
											selectedSize === size.value
												? "default"
												: "outline"
										}
										size="sm"
										onClick={() =>
											setSelectedSize(size.value)
										}
										disabled={size.isAvailable === false}
									>
										{size.value}
									</Button>
								))}
							</div>
						</div>
					)}

					<Separator />

					{/* Bundle Items - Show only for BUNDLE type products */}
					{product.type === "BUNDLE" &&
						product.parentBundle.length > 0 && (
							<div className="space-y-4">
								<h2 className="text-xl font-semibold">
									Что входит в комплект
								</h2>
								<div className="grid gap-4">
									{product.parentBundle.map((bundleItem) => (
										<Card
											key={bundleItem.childId}
											className="p-4 hover:shadow-md transition-shadow"
										>
											<div className="flex items-center gap-4">
												{/* Product Image */}
												<div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
													{bundleItem.child.images &&
													bundleItem.child.images
														.length > 0 ? (
														<img
															src={
																bundleItem.child
																	.images[0]
																	.url ||
																"/placeholder.svg"
															}
															alt={
																bundleItem.child
																	.name
															}
															className="object-cover w-full h-full"
														/>
													) : (
														<div className="flex h-full items-center justify-center bg-secondary/20">
															<span className="text-xs text-muted-foreground">
																No image
															</span>
														</div>
													)}
												</div>

												{/* Product Info */}
												<div className="flex-1 min-w-0">
													<Link
														to={`/product/${bundleItem.childId}`}
														className="text-left hover:text-primary transition-colors"
													>
														<h3 className="font-medium text-sm truncate">
															{
																bundleItem.child
																	.name
															}
														</h3>
														<p className="text-sm text-muted-foreground">
															SKU:{" "}
															{
																bundleItem.child
																	.sku
															}
														</p>
													</Link>
												</div>

												{/* Quantity and Price */}
												<p className="text-sm font-semibold text-primary">
													{formatPrice(
														bundleItem.child.price
													)}
												</p>
											</div>
										</Card>
									))}
								</div>
							</div>
						)}

					<Separator />

					{product.description && (
						<div className="space-y-2 pb-20">
							<h2 className="text-xl font-semibold">О товаре</h2>
							<p className="text-muted-foreground">
								{product.description}
							</p>
						</div>
					)}

					<div className="fixed bottom-0 left-0 w-full bg-white border-t-2 p-4 shadow-md">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<Button
									variant="outline"
									size="icon"
									onClick={decrementQuantity}
									disabled={quantity <= 1}
									aria-label="Decrease quantity"
								>
									<Minus className="h-4 w-4" />
								</Button>
								<Card className="h-10 w-12 flex items-center justify-center rounded-md shadow-sm border">
									<span className="font-semibold">
										{quantity}
									</span>
								</Card>
								<Button
									variant="outline"
									size="icon"
									onClick={incrementQuantity}
									aria-label="Increase quantity"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							<Button
								className="flex items-center gap-2 px-5 py-2 text-base font-medium"
								size="lg"
								onClick={handleAddToCart}
							>
								<ShoppingCart className="h-5 w-5" />
								Add to Cart
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductDetails;
