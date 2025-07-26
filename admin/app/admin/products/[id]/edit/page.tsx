"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Category, Product, ProductSize, ProductType } from "@/app/types";
import { uploadFiles } from "@/lib/utils";
import ProductBundleTable from "../../create/product-bundle-table";
import ProductSizes from "../../components/ProductSizes";
import BasicInformation from "../../components/BasicInformation";
import ProductTypeSelector from "../../components/ProductTypeSelector";
import ProductImageUpload from "../../components/ProductImageUpload";

interface ProductImage {
	id?: number;
	url: string;
	file?: File;
}

export default function EditProductPage() {
	const router = useRouter();
	const params = useParams();
	const productId = params.id as string;

	const [loading, setLoading] = useState(true);
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
	const [originalProduct, setOriginalProduct] = useState<Product | null>(
		null
	);

	useEffect(() => {
		const fetchData = async () => {
			if (!productId) return;

			try {
				setLoading(true);

				// Загрузка товара
				const productRes = await fetch(
					`/api/admin/product/${productId}`
				);
				if (!productRes.ok) throw new Error("Ошибка загрузки товара");
				const product: Product = await productRes.json();

				setOriginalProduct(product);

				// Загрузка категорий
				const categoriesRes = await fetch("/api/admin/category");
				if (!categoriesRes.ok)
					throw new Error("Ошибка загрузки категорий");
				const categoriesData = await categoriesRes.json();
				setCategories(categoriesData);

				// Обновление состояния формы
				setFormData({
					sku: product.sku,
					name: product.name,
					description: product.description || "",
					markup: product.markup,
					type: product.type,
					childBundles: (product.parentBundle as any) || [],
					categoryId: product.categoryId,
				});

				// Изображения
				setImages(product.images || []);

				// Размеры
				setSizes(product.sizes || []);
			} catch (error) {
				console.error("Ошибка загрузки данных:", error);
				toast.error(
					"Не удалось загрузить данные. Пожалуйста, попробуйте снова."
				);
				router.push("/admin/products");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [productId, router]);

	const handleInputChange = (field: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;

		const newImages: ProductImage[] = [];

		Array.from(files).forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				newImages.push({
					url: e.target?.result as string,
					file,
				});

				if (newImages.length === files.length) {
					setImages((prev) => [...prev, ...newImages]);
				}
			};
			reader.readAsDataURL(file);
		});
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Подготовка изображений
			const newImages = images.filter((img) => img.file);
			const existingImages = images.filter((img) => !img.file);
			const uploadedImages =
				newImages.length > 0 ? await uploadFiles(newImages) : [];

			const allImages = [
				...existingImages.map((img) => ({ url: img.url, id: img.id })),
				...uploadedImages,
			];

			// Подготовка данных
			const payload = {
				...formData,
				categoryId: Number(formData.categoryId),
				markup: formData.markup,
				images: allImages,
				sizes: sizes,
			};

			// Отправка запроса
			const response = await fetch(`/api/admin/product/${productId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Ошибка обновления товара");
			}

			toast.success("Товар успешно обновлен!");
			router.push("/admin/products");
		} catch (error) {
			console.error("Ошибка обновления товара:", error);
			toast.error(
				"Не удалось обновить товар. Пожалуйста, попробуйте снова."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (
			!confirm(
				"Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить."
			)
		) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/product/${productId}`, {
				method: "DELETE",
			});

			if (!response.ok) throw new Error("Ошибка удаления товара");

			toast.success("Товар успешно удален!");
			router.push("/admin/products");
		} catch (error) {
			console.error("Ошибка удаления товара:", error);
			toast.error(
				"Не удалось удалить товар. Пожалуйста, попробуйте снова."
			);
		}
	};

	if (loading) {
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
						<h1 className="text-lg font-semibold">
							Редактирование товара
						</h1>
					</div>
				</header>
				<div className="flex-1 flex items-center justify-center">
					<div className="flex items-center gap-2">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span>Загрузка товара...</span>
					</div>
				</div>
			</div>
		);
	}

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
					<h1 className="text-lg font-semibold">
						Редактирование товара
					</h1>
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
								Редактировать товар
							</h2>
							<p className="text-muted-foreground">
								Обновите информацию о товаре
							</p>
							{originalProduct && (
								<Badge variant="outline" className="mt-2">
									ID: {originalProduct.id} • SKU:{" "}
									{originalProduct.sku}
								</Badge>
							)}
						</div>
						<div className="flex space-x-2">
							<Button
								type="button"
								variant="destructive"
								onClick={handleDelete}
							>
								Удалить
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								<Save className="mr-2 h-4 w-4" />
								{isSubmitting
									? "Сохранение..."
									: "Сохранить изменения"}
							</Button>
						</div>
					</div>

					{/* Основная информация */}
					<BasicInformation
						formData={formData}
						handleInputChange={handleInputChange}
						categories={categories}
					/>
					{/* Тип товара */}
					<ProductTypeSelector
						formData={formData}
						handleInputChange={handleInputChange}
					/>

					{/* Комплект товаров */}
					{formData.type === ProductType.BUNDLE && (
						<Card>
							<ProductBundleTable
								useFormData={[
									formData.childBundles as any[],
									setFormData,
								]}
								editingElemntId={productId}
							/>
						</Card>
					)}

					{/* Изображения */}
					<ProductImageUpload
						images={images}
						handleImageUpload={handleImageUpload}
						removeImage={removeImage}
					/>

					{/* Размеры */}
					{formData.type === ProductType.SINGLE && (
						<ProductSizes
							sizes={sizes}
							setSizes={setSizes}
							formData={formData}
						/>
					)}

					{/* Действия */}
					<div className="flex justify-between pt-6">
						<div className="flex space-x-4">
							<Link href="/admin/products">
								<Button type="button" variant="outline">
									Отмена
								</Button>
							</Link>
							<Button type="submit" disabled={isSubmitting}>
								<Save className="mr-2 h-4 w-4" />
								{isSubmitting
									? "Сохранение..."
									: "Сохранить изменения"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
