"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronLeft, Flame } from "lucide-react";
import Slider from "./product-page/slider";
import { Product, ProductType } from "@/types";
import { usePrice } from "@/context/PriceContext";
import { formatPrice } from "@/lib/utils";
import SizeSelector from "./SizeSelector";
import CartFooter from "@/layout/cart-footer";
import { CartItem } from "@/context/CartProvider";

interface ProductDetailsProps {
	product: Product;
}

function ProductDetails({ product }: ProductDetailsProps) {
	const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
	const isBundle = product.type === ProductType.BUNDLE;
	const navigate = useNavigate();

	const { calculate } = usePrice();

	const cartElement: CartItem = {
		localId: Math.random(),
		id: product.id,
		type: product.type,
		image: product.images?.[0]?.url,
		variantId: selectedSize.id || 0,
		weight: selectedSize.weight,
		markup: product.markup,
		title: product.name,
		quantity: 1,
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

					{!isBundle && (
						<>
							<div className="w-full flex items-center justify-between">
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
								<div className="flex items-end flex-col gap-2">
									<span className="text-2xl text-primary">
										{formatPrice(
											calculate({
												weight:
													selectedSize?.weight || 0,
												markup: product.markup,
											})
										)}
									</span>
									<span>{selectedSize?.weight} грам </span>
								</div>
							</div>

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
						</>
					)}

					<Separator />

					{/* Bundle Items - Show only for BUNDLE type products */}
					{isBundle && product.parentBundle.length > 0 && (
						<BundleContainer product={product} />
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
				</div>
			</div>
			{/* TODO: this cart footer for Bundle products */}
			<CartFooter
				product={product}
				cartElement={cartElement}
				selectedSize={selectedSize}
			/>
			<br />
		</div>
	);
}

function BundleContainer({ product }: { product: Product }) {
	const [items, setItems] = useState({});

	const total: any = useMemo(() => {
		if (product.parentBundle.length === 0) return 0;
		let price = 0;
		let weight = 0;

		for (let id in items) {
			const item: any = items[id as keyof typeof items];

			if (item) {
				price += item.price;
				weight += item.weight;
			}
		}

		return { weight, price };
	}, [items]);

	return (
		<div className="space-y-4">
			<div className="flex items-start flex-col gap-2">
				<p className="text-lg font-semibold">
					Цена: {formatPrice(total.price)}
				</p>
				<p className="text-sm text-muted-foreground">
					Общий вес в граммах: {total.weight}
				</p>
			</div>
			<Separator className="mb-4" />
			<h2 className="text-xl font-semibold">Что входит в комплект</h2>
			<div className="grid gap-4">
				{product.parentBundle.map((bundleItem) => (
					<BundleItemCard
						key={bundleItem.bundleId}
						bundleItem={bundleItem}
						setItem={setItems}
					/>
				))}
			</div>
		</div>
	);
}

const BundleItemCard = memo(
	({ bundleItem, setItem }: { bundleItem: any; setItem: any }) => {
		const { child } = bundleItem;
		const [selectedSize, setSelectedSize] = useState(child.sizes[0]);
		const { calculate } = usePrice();

		const price = useMemo(
			() =>
				calculate({
					weight: selectedSize?.weight || 0,
					markup: bundleItem.child.markup,
				}),
			[selectedSize, bundleItem.child.markup]
		);

		useEffect(() => {
			setItem((prev: any) => ({
				...prev,
				[bundleItem.bundleId]: {
					weight: selectedSize.weight,
					markup: child.markup,
					price: price,
				},
			}));
			return () => {
				setItem((prev: any) => {
					const newItems = { ...prev };
					delete newItems[bundleItem.bundleId];
					return newItems;
				});
			};
		}, [selectedSize, price]);

		return (
			<Card className="p-4 hover:shadow-md transition-shadow">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-2">
						<div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
							{child.images && child.images.length > 0 ? (
								<img
									src={
										child.images[0].url ||
										"/placeholder.svg"
									}
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
						<p>{formatPrice(price)}</p>
					</div>
				</div>
			</Card>
		);
	}
);

export default ProductDetails;
