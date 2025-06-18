"use client";

import type React from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	ArrowLeft,
	Upload,
	X,
	Plus,
	Package,
	Save,
	Eye,
	Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Category, Product, ProductSize, ProductType } from "@/app/types";
import { formatPrice, uploadFiles } from "@/lib/utils";
import ProductBundleTable from "../../create/product-bundle-table";
import { usePrice } from "@/context/PriceContext";
import ProductSizes from "../../components/ProductSizes";

const ProductTypes = {
	SINGLE: "Изделие",
	BUNDLE: "Комплект",
};

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
	// const [bundleProducts, setBundleProducts] = useState<any>(null);
	const [originalProduct, setOriginalProduct] = useState<Product | null>(
		null
	);

	// Загрузка данных товара
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

	const handleInputChange = (field: string, value: string) => {
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
				markup: Number(formData.markup),
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
						isBundle={formData.type === ProductType.BUNDLE}
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
						{/* <Button
							type="button"
							variant="destructive"
							onClick={handleDelete}
						>
							Удалить товар
						</Button> */}
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

// Остальные компоненты (BasicInformation, ProductTypeSelector и т.д.)
// остаются аналогичными созданию товара, но с учетом особенностей редактирования

function BasicInformation({
	formData,
	handleInputChange,
	categories = [],
	isBundle,
}: // calcualte,
{
	formData: any;
	handleInputChange: (field: string, value: string) => void;
	categories?: Category[];
	isBundle: boolean;
	// calcualte: ({
	// 	weight,
	// 	markup,
	// }: {
	// 	weight: number;
	// 	markup: number;
	// }) => number;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Basic Information</CardTitle>
				<CardDescription>
					Essential product details and identification
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
							Unique product identifier
						</p>
					</div>
					<div className="space-y-2">
						<Label htmlFor="name">Product Name *</Label>
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
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						placeholder="Describe your product..."
						value={formData.description}
						onChange={(e) =>
							handleInputChange("description", e.target.value)
						}
						rows={3}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{!isBundle && (
						<div className="space-y-2">
							<Label htmlFor="markup">
								Наценка (в процентах)
							</Label>
							<Input
								id="markup"
								type="number"
								// step="0.1"
								placeholder="0.0"
								value={formData.markup}
								onChange={(e) =>
									handleInputChange("markup", e.target.value)
								}
							/>
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="category">Category *</Label>
						<Select
							value={formData.categoryId}
							onValueChange={(value) =>
								handleInputChange("categoryId", value)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select category" />
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

function ProductTypeSelector({
	formData,
	handleInputChange,
}: {
	formData: any;
	handleInputChange: (field: string, value: string) => void;
}) {
	return (
		<Card className="flex flex-col sm:flex-row items-start justify-between">
			<div className="w-full h-full">
				<CardHeader className="mb-4">
					<CardTitle>Product Classification</CardTitle>
					<CardDescription>
						Product type and material specifications
					</CardDescription>
				</CardHeader>
			</div>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="type">Product Type</Label>
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

function ProductImageUpload({
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
				<CardTitle>Product Images</CardTitle>
				<CardDescription>
					Upload product photos (first image will be the main image)
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
							{!image.file && image.id && (
								<Badge
									variant="secondary"
									className="absolute bottom-2 right-2"
								>
									Existing
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
