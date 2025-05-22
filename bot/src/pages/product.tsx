import { useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Minus,
	Plus,
	ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Header } from "@/components/custom/header";
import { SidebarNav } from "@/components/custom/sidebar-nav";
import { useNavigate } from "react-router-dom";

interface ProductImage {
	id: number;
	url: string;
	productId: number;
}

interface Product {
	id: number;
	name: string;
	description: string | null;
	price: number;
	categoryId: number;
	images: ProductImage[];
	createdAt: Date;
	updatedAt: Date;
}

export default function ProductPage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const product = {
		id: Number.parseInt((122.22).toString()),
		name: "Premium Wireless Headphones",
		description:
			"Experience crystal-clear sound with our premium wireless headphones. Featuring noise cancellation technology and 20-hour battery life.",
		price: 19999, // Price in smallest unit (e.g., cents)
		categoryId: 1,
		images: [
			{
				id: 1,
				url: "/placeholder.svg?height=600&width=600",
				productId: 1,
			},
			{
				id: 2,
				url: "/placeholder.svg?height=600&width=600",
				productId: 1,
			},
			{
				id: 3,
				url: "/placeholder.svg?height=600&width=600",
				productId: 1,
			},
		],
		createdAt: new Date(),
		updatedAt: new Date(),
	};
	return (
		<>
			<Header onMenuClick={() => setSidebarOpen(true)} />
			<SidebarNav
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
			<ProductDetails product={product} />
		</>
	);
}

function ProductDetails({ product }: { product: Product }) {
	const [quantity, setQuantity] = useState(1);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const navigate = useNavigate();

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(price / 100);
	};

	const incrementQuantity = () => {
		setQuantity((prev) => prev + 1);
	};

	const decrementQuantity = () => {
		setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
	};

	const addToCart = () => {
		// This would be replaced with your actual cart logic
		console.log(`Added ${quantity} of product ${product.id} to cart`);
		alert(`Added ${quantity} of ${product.name} to cart`);
	};

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
	};

	const prevImage = () => {
		setCurrentImageIndex(
			(prev) => (prev - 1 + product.images.length) % product.images.length
		);
	};

	// const scrollbarHideClass = "scrollbar-hide";

	return (
		<div className="container mx-auto px-4 pb-8">
			<div className="flex items-center py-4 border-b">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate(-1)}
					className="mr-2"
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-lg font-semibold truncate">
					{product.name}
				</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Product Images */}
				<div className="space-y-6">
					<div className="relative aspect-square overflow-hidden rounded-lg">
						{product.images.length > 0 ? (
							<>
								<div className="relative h-full w-full">
									{product.images.map((image, index) => (
										<div
											key={image.id}
											className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
												index === currentImageIndex
													? "opacity-100"
													: "opacity-0"
											}`}
										>
											<img
												src={
													image.url ||
													"/placeholder.svg"
												}
												alt={product.name}
												className="object-cover w-full h-full"
											/>
										</div>
									))}
								</div>
								{product.images.length > 1 && (
									<>
										<button
											className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm hover:bg-white/90 transition-colors"
											onClick={prevImage}
										>
											<ChevronLeft className="h-5 w-5 text-gray-700" />
											<span className="sr-only">
												Previous image
											</span>
										</button>
										<button
											className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm hover:bg-white/90 transition-colors"
											onClick={nextImage}
										>
											<ChevronRight className="h-5 w-5 text-gray-700" />
											<span className="sr-only">
												Next image
											</span>
										</button>
									</>
								)}
							</>
						) : (
							<div className="flex h-full items-center justify-center bg-secondary/20">
								<p className="text-muted-foreground">
									No image available
								</p>
							</div>
						)}
					</div>

					{product.images.length > 1 && (
						<>
							{/* Slide indicators */}
							<div className="flex justify-center space-x-2 mt-4">
								{product.images.map((_, index) => (
									<button
										key={index}
										onClick={() =>
											setCurrentImageIndex(index)
										}
										className={`h-1.5 rounded-full transition-all ${
											index === currentImageIndex
												? "w-6 bg-primary"
												: "w-2 bg-gray-300"
										}`}
										aria-label={`Go to slide ${index + 1}`}
									/>
								))}
							</div>

							{/* Thumbnails */}
							<div
								className={cn(
									"flex space-x-2 overflow-x-auto pb-2 scrollbar-hide"
								)}
							>
								{product.images.map((image, index) => (
									<button
										key={image.id}
										className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md transition-all ${
											index === currentImageIndex
												? "ring-2 ring-primary scale-105"
												: "opacity-70 hover:opacity-100"
										}`}
										onClick={() =>
											setCurrentImageIndex(index)
										}
									>
										<img
											src={
												image.url || "/placeholder.svg"
											}
											alt={`${product.name} thumbnail ${
												index + 1
											}`}
											className="object-cover w-full h-full"
										/>
									</button>
								))}
							</div>
						</>
					)}
				</div>

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

					<Separator />

					{product.description && (
						<div className="space-y-2">
							<h2 className="text-xl font-semibold">
								Description
							</h2>
							<p className="text-muted-foreground">
								{product.description}
							</p>
						</div>
					)}

					<Separator />

					<div className="space-y-4">
						<div className="space-y-2">
							<h2 className="text-xl font-semibold">Quantity</h2>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="icon"
									onClick={decrementQuantity}
									disabled={quantity <= 1}
								>
									<Minus className="h-4 w-4" />
									<span className="sr-only">
										Decrease quantity
									</span>
								</Button>
								<Card className="flex h-10 w-12 items-center justify-center">
									<span className="text-center font-medium">
										{quantity}
									</span>
								</Card>
								<Button
									variant="outline"
									size="icon"
									onClick={incrementQuantity}
								>
									<Plus className="h-4 w-4" />
									<span className="sr-only">
										Increase quantity
									</span>
								</Button>
							</div>
						</div>

						<Button
							className="w-full"
							size="lg"
							onClick={addToCart}
						>
							<ShoppingCart className="mr-2 h-5 w-5" />
							Add to Cart
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
