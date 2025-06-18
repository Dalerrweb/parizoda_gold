"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Category, Product, ProductSize, ProductType } from "@/app/types";
import { uploadFiles } from "@/lib/utils";
import ProductBundleTable from "./product-bundle-table";
import { useRouter } from "next/navigation";
import ProductSizes from "../components/ProductSizes";
import BasicInformation from "../components/BasicInformation";
import ProductTypeSelector from "../components/ProductTypeSelector";
import ProductImageUpload from "../components/ProductImageUpload";

interface ProductImage {
	id?: number;
	url: string;
	file?: File;
}

export default function CreateProductPage() {
	const [formData, setFormData] = useState<Product>({
		sku: "",
		name: "",
		description: "",
		markup: 0,
		type: ProductType.SINGLE,
		childBundles: [],
		categoryId: 0,
	});

	const [categories, setCategories] = useState<Category[]>([]);
	const [images, setImages] = useState<ProductImage[]>([]);
	const [sizes, setSizes] = useState<ProductSize[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (formData.type === ProductType.BUNDLE) {
			setSizes([]);
		} else {
			setFormData((prev) => ({
				...prev,
				childBundles: [],
			}));
		}
	}, [formData.type]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/admin/category");
				if (!response.ok) {
					throw new Error("Failed to fetch categories");
				}
				const data = await response.json();

				setCategories(data);
			} catch (error) {
				console.error("Error fetching categories:", error);
				toast.error("Failed to load categories. Please try again.");
			}
		};
		fetchCategories();
	}, []);

	const handleInputChange = (field: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					const newImage: ProductImage = {
						url: e.target?.result as string,
						file: file,
					};
					setImages((prev) => [...prev, newImage]);
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const productResponse = await fetch("/api/admin/product", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					categoryId: formData.categoryId,
					images: [],
					sizes: sizes,
				}),
			});

			// 2. Проверяем ошибки сервера
			if (!productResponse.ok) {
				const errorData = await productResponse.json();
				throw new Error(
					errorData.message || "Ошибка сохранения продукта"
				);
			}

			// 3. Если продукт сохранён — загружаем файлы
			const productData = await productResponse.json();
			const uploadedImages = await uploadFiles(images);

			// 4. Обновляем продукт с привязкой изображений
			await fetch(`/api/admin/product/${productData.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ images: uploadedImages }),
			});

			// // router.replace("/admin/products");
			toast("Product created successfully!");
		} catch (e) {
			console.error("Error creating product:", e);
			toast.error("Failed to create product. Please try again.");
		}

		setIsSubmitting(false);
	};

	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<div className="flex flex-1 items-center gap-2">
					<Link href="/admin/products">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Вернуться к товарам
						</Button>
					</Link>
				</div>
			</header>

			<div className="flex-1 p-4 md:p-8 pt-6">
				<form
					onSubmit={handleSubmit}
					className="max-w-4xl mx-auto space-y-6"
				>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-3xl font-bold tracking-tight">
								Создайте новый товар
							</h2>
							<p className="text-muted-foreground">
								Добавить новый товар в ваш склад
							</p>
						</div>
						<div className="flex space-x-2">
							{/* <Button type="button" variant="outline">
								<Eye className="mr-2 h-4 w-4" />
								Preview
							</Button> */}
							<Button type="submit" disabled={isSubmitting}>
								<Save className="mr-2 h-4 w-4" />
								{isSubmitting
									? "Создается..."
									: "Создать товар"}
							</Button>
						</div>
					</div>

					{/* Basic Information */}
					<BasicInformation
						formData={formData}
						handleInputChange={handleInputChange}
						categories={categories}
					/>

					{/* Product Type & Metal */}
					<ProductTypeSelector
						formData={formData}
						handleInputChange={handleInputChange}
					/>

					{formData.type === "BUNDLE" && (
						<Card>
							<ProductBundleTable
								useFormData={[
									formData.childBundles as any[],
									setFormData,
								]}
							/>
						</Card>
					)}

					{/* Product Images */}
					<ProductImageUpload
						images={images}
						handleImageUpload={handleImageUpload}
						removeImage={removeImage}
					/>

					{/* Product Sizes */}
					{formData.type === ProductType.SINGLE && (
						<ProductSizes
							sizes={sizes}
							setSizes={setSizes}
							formData={formData}
						/>
					)}

					{/* Form Actions */}
					<div className="flex justify-end space-x-4 pt-6">
						<Link href="/admin/products">
							<Button type="button" variant="outline">
								Отмена
							</Button>
						</Link>
						<Button type="submit" disabled={isSubmitting}>
							<Save className="mr-2 h-4 w-4" />
							{isSubmitting
								? "Товар создается..."
								: "Создать товар"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
