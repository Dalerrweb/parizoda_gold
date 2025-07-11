"use client";

import type React from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Category, ProductType } from "@/app/types";

export default function BasicInformation({
	formData,
	handleInputChange,
	categories = [],
}: {
	formData: any;
	handleInputChange: (field: string, value: string | number) => void;
	categories?: Category[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Базовая информация</CardTitle>
				<CardDescription>
					Основная информация о продукте и его идентификация
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="sku">SKU *</Label>
						<Input
							id="sku"
							placeholder="e.g., PROD-001"
							value={formData.sku}
							onChange={(e) =>
								handleInputChange("sku", e.target.value)
							}
							required
						/>
						<p className="text-xs text-muted-foreground">
							Уникальныя единица складского учёта
						</p>
					</div>
					<div className="space-y-2">
						<Label htmlFor="name">Название изделия *</Label>
						<Input
							id="name"
							placeholder="Enter product name"
							value={formData.name}
							onChange={(e) =>
								handleInputChange("name", e.target.value)
							}
							required
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Описание</Label>
					<Textarea
						id="description"
						placeholder="Опишите изделие"
						value={formData.description}
						onChange={(e) =>
							handleInputChange("description", e.target.value)
						}
						rows={3}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label htmlFor="price">
							Цена (высчитывается автоматически)
						</Label>
						<div className="relative">
							<span className="absolute left-3 top-1.5 text-muted-foreground">
								сум
							</span>
							<Input
								id="price"
								type="number"
								readOnly
								value={0}
								placeholder="0"
								className="pl-12"
								required
							/>
						</div>
					</div>
					{formData.type === ProductType.SINGLE && (
						<div className="space-y-2">
							<Label htmlFor="markup">
								Наценка (в процентах)
							</Label>
							<div className="relative">
								<span className="absolute left-3 top-1.5 text-muted-foreground">
									%
								</span>
								<Input
									id="markup"
									type="number"
									value={formData.markup}
									onChange={(e) =>
										handleInputChange(
											"markup",
											+e.target.value
										)
									}
									placeholder="0"
									className="pl-12"
									required
								/>
							</div>
						</div>
					)}

					{/* <div className="space-y-2">
                        <Label htmlFor="weight">Weight (grams)</Label>
                        <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={formData.weight}
                            onChange={(e) =>
                                handleInputChange("weight", e.target.value)
                            }
                        />
                    </div> */}
					<div className="space-y-2">
						<Label htmlFor="category">Категория *</Label>
						<Select
							value={formData.categoryId}
							onValueChange={(value) =>
								handleInputChange("categoryId", +value)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Выбрать категорию" />
							</SelectTrigger>
							<SelectContent>
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
				</div>
			</CardContent>
		</Card>
	);
}
