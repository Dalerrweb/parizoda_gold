"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Check,
	ChevronLeft,
	Flame,
	Minus,
	Plus,
	ShoppingCart,
} from "lucide-react";
import Slider from "./product-page/slider";
import { Product, ProductType } from "@/types";
import { usePrice } from "@/context/PriceContext";
import { formatPrice } from "@/lib/utils";
import SizeSelector from "./SizeSelector";

interface ProductDetailsProps {
	product: Product;
}

function ProductDetails({ product }: ProductDetailsProps) {
	const [quantity, setQuantity] = useState(1);
	const { calculate } = usePrice();

	const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
	const navigate = useNavigate();
	const isBundle = product.type === ProductType.BUNDLE;

	const incrementQuantity = (): void => {
		setQuantity((prev) => prev + 1);
	};

	const decrementQuantity = (): void => {
		setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
	};

	const handleAddToCart = (): void => {
		console.log(`Added ${quantity} of product ${product.id} to cart`);
		alert(`Added ${quantity} of ${product.name} to cart`);
	};

	return (
		<div className="container mx-auto px-4 pb-8">
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
						<p className="mt-4 text-2xl font-semibold text-primary"></p>
					</div>

					{/* {product.sizes.length > 0 && ( */}
					<div className="w-full flex items-center justify-between">
						{!isBundle ? (
							<div className="space-y-2">
								<h2 className="text-xl font-semibold">
									Размеры
								</h2>
								<SizeSelector
									sizes={product.sizes}
									selectedSize={selectedSize}
									onSelectSize={setSelectedSize}
								/>{" "}
							</div>
						) : null}
						<div
							className={`flex ${
								isBundle ? "items-start" : "items-end"
							} flex-col gap-2`}
						>
							<span className="text-2xl text-primary">
								{formatPrice(
									calculate({
										weight: selectedSize?.weight || 0,
										markup: product.markup,
									})
								)}
							</span>
							<span>{selectedSize?.weight} грам </span>
						</div>
					</div>

					{/* TODO: Оптимизировать компонент */}

					{!isBundle && (
						<div className="w-fit flex items-center gap-2">
							{selectedSize?.quantity < 3 ? (
								<div className="bg-red-300 p-2 rounded-md">
									<Flame />
								</div>
							) : (
								<div className="bg-[#CEF1D7] p-2 rounded-md">
									<Check />
								</div>
							)}
							<p className="text-sm text-muted-foreground">
								В наличии: {selectedSize?.quantity} шт
							</p>
						</div>
					)}

					<Separator />

					{/* Bundle Items - Show only for BUNDLE type products */}
					{product.type === ProductType.BUNDLE &&
						product.parentBundle.length > 0 && (
							<div className="space-y-4">
								<h2 className="text-xl font-semibold">
									Что входит в комплект
								</h2>
								<div className="grid gap-4">
									{product.parentBundle.map((bundleItem) => (
										<BundleItemCard
											key={bundleItem.bundleId}
											bundleItem={bundleItem}
										/>
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

function BundleItemCard({ bundleItem }: { bundleItem: any }) {
	const { child } = bundleItem;
	const [selectedSize, setSelectedSize] = useState(child.sizes[0]);
	const { calculate } = usePrice();

	return (
		<Card className="p-4 hover:shadow-md transition-shadow">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-center gap-2">
					<div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
						{child.images && child.images.length > 0 ? (
							<img
								src={child.images[0].url || "/placeholder.svg"}
								alt={child.name}
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
					<div className="text-left hover:text-primary transition-colors">
						<h3 className="font-medium text-sm truncate">
							{child.name}
						</h3>
						<p className="text-sm text-muted-foreground">
							Вес: {selectedSize.weight} г
						</p>
						<p className="text-sm text-muted-foreground">
							В наличии: {selectedSize.quantity}
						</p>
					</div>
				</div>

				<div className="flex flex-col items-end gap-2">
					<SizeSelector
						sizes={child.sizes}
						selectedSize={selectedSize}
						onSelectSize={setSelectedSize}
					/>
					<p>
						{formatPrice(
							calculate({
								weight: selectedSize?.weight || 0,
								markup: child.markup,
							})
						)}
					</p>
				</div>
			</div>
		</Card>
	);
}

export default ProductDetails;
