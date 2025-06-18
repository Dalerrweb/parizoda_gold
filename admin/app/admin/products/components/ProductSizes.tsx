"use client";

import type React from "react";

import { Dispatch, SetStateAction } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Package } from "lucide-react";
import { Product, ProductSize } from "@/app/types";
import { formatPrice } from "@/lib/utils";
import { usePrice } from "@/context/PriceContext";

export default function ProductSizes({
	sizes,
	setSizes,
	formData,
}: {
	sizes: ProductSize[];
	setSizes: Dispatch<SetStateAction<ProductSize[]>>;
	formData: Product;
}) {
	const { calculate } = usePrice();

	const updateSize = (
		index: number,
		field: keyof ProductSize,
		value: string | number
	) => {
		setSizes((prev: ProductSize[]) =>
			prev.map((size, i) =>
				i === index ? { ...size, [field]: value } : size
			)
		);
	};

	const removeSize = (index: number) => {
		setSizes((prev) => prev.filter((_, i) => i !== index));
	};

	const addSize = () => {
		setSizes((prev) => [...prev, { size: "", quantity: 0, weight: 0 }]);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					Размеры и запасы товара
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addSize}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Size
					</Button>
				</CardTitle>
				<CardDescription>
					Укажите размеры, количество на складе и вес для расчёта
					цены.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{sizes.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>
							Нет размеров. Нажмите кнопку "Добавить размер",
							чтобы начать.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{sizes.map((size, index) => (
							<div
								key={index}
								className="flex items-center space-x-4 p-4 border rounded-lg"
							>
								<div className="flex-1">
									<Label htmlFor={`size-${index}`}>
										Размер
									</Label>
									<Input
										id={`size-${index}`}
										placeholder="e.g., S, M, L, XL"
										value={size.size}
										onChange={(e) =>
											updateSize(
												index,
												"size",
												e.target.value
											)
										}
									/>
								</div>
								<div className="flex-1">
									<Label htmlFor={`stock-${index}`}>
										Кол-во
									</Label>
									<Input
										id={`stock-${index}`}
										type="number"
										min="0"
										placeholder="0"
										value={size.quantity}
										onChange={(e) =>
											updateSize(
												index,
												"quantity",
												Number.parseInt(
													e.target.value
												) || 0
											)
										}
									/>
								</div>
								<div className="flex-1">
									<Label htmlFor={`weight-${index}`}>
										Вес в граммах
									</Label>
									<Input
										id={`weight-${index}`}
										type="number"
										min="0"
										placeholder="0"
										value={size.weight}
										onChange={(e) =>
											updateSize(
												index,
												"weight",
												Number.parseInt(
													e.target.value
												) || 0
											)
										}
									/>
								</div>
								<div>
									{formatPrice(
										calculate({
											weight: size.weight,
											markup: formData.markup,
										})
									)}
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => removeSize(index)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
