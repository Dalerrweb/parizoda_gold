"use client";

import type React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Category } from "@/app/types";

const ProductTypes = {
	SINGLE: "Изделие",
	BUNDLE: "Комплект",
};

export default function ProductTypeSelector({
	formData,
	handleInputChange,
}: {
	formData: any;
	handleInputChange: (field: string, value: string) => void;
	categories?: Category[];
}) {
	return (
		<Card className="flex flex-col sm:flex-row items-start justify-between">
			<div className="w-full h-full">
				<CardHeader className="mb-4">
					<CardTitle>Классификация товара</CardTitle>
					<CardDescription>
						Если вы создаёте комплект, то не сможете добавить
						наценку или указать размеры вручную — они будут
						автоматически взяты из товаров, входящих в комплект.
					</CardDescription>
				</CardHeader>
			</div>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="type">Тип товара</Label>
					<Select
						value={formData.type}
						onValueChange={(value) =>
							handleInputChange("type", value)
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(ProductTypes).map(
								([key, label]) => (
									<SelectItem key={key} value={key}>
										{label}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	);
}
