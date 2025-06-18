"use client";

import type React from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";

interface ProductImage {
	id?: number;
	url: string;
	file?: File;
}

export default function ProductImageUpload({
	images,
	handleImageUpload,
	removeImage,
}: {
	images: ProductImage[];
	handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
	removeImage: (index: number) => void;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Картинки товара</CardTitle>
				<CardDescription>
					Загрузите фотографии товара (первая будет использоваться как
					основная). <br /> ⚠️ Загружайте изображения с небольшим
					размером файла, чтобы улучшить скорость работы приложения.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{images.map((image, index) => (
						<div key={index} className="relative group">
							<img
								src={image.url || "/placeholder.svg"}
								alt={`Product image ${index + 1}`}
								className="w-full h-32 object-cover rounded-lg border"
							/>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={() => removeImage(index)}
							>
								<X className="h-3 w-3" />
							</Button>
							{index === 0 && (
								<Badge className="absolute bottom-2 left-2">
									Main
								</Badge>
							)}
						</div>
					))}
					<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
						<Upload className="h-8 w-8 text-muted-foreground mb-2" />
						<span className="text-sm text-muted-foreground">
							Upload Images
						</span>
						<input
							type="file"
							multiple
							accept="image/*"
							className="hidden"
							onChange={handleImageUpload}
						/>
					</label>
				</div>
			</CardContent>
		</Card>
	);
}
