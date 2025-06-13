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
import { ArrowLeft, Upload, X, Plus, Package, Save, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Category, ProductSize, ProductType } from "@/app/types";
import { uploadFiles } from "@/lib/utils";
import ProductBundleTable from "./product-bundle-table";
import { useRouter } from "next/navigation";

// Enums based on your Prisma schema
const ProductTypes = {
	SINGLE: "Изделие",
	BUNDLE: "Комплект",
};

interface ProductImage {
	id?: number;
	url: string;
	file?: File;
}

export default function CreateProductPage() {
	const [formData, setFormData] = useState({
		sku: "",
		name: "",
		description: "",
		markup: "",
		type: "SINGLE",
		childBundles: [],
		categoryId: "",
	});

	const [categories, setCategories] = useState<Category[]>([]);
	const [images, setImages] = useState<ProductImage[]>([]);
	const [sizes, setSizes] = useState<ProductSize[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [bundleProducts, setBundleProducts] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			// weight: bundleProducts?.totalBundleWeight || 0,
			childBundles: bundleProducts?.selectedProducts || [],
		}));
	}, [bundleProducts]);

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

	const handleInputChange = (field: string, value: string) => {
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

	const addSize = () => {
		setSizes((prev) => [...prev, { size: "", quantity: 0, weight: 0 }]);
	};

	const updateSize = (
		index: number,
		field: keyof ProductSize,
		value: string | number
	) => {
		setSizes((prev) =>
			prev.map((size, i) =>
				i === index ? { ...size, [field]: value } : size
			)
		);
	};

	const removeSize = (index: number) => {
		setSizes((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			console.log(formData, sizes);

			const productResponse = await fetch("/api/admin/product", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					categoryId: Number.parseInt(formData.categoryId),
					images: [], // Пока без изображений
					sizes: sizes,
					// .map((size) => ({
					// 	value: size.size,
					// 	quantity: size.quantity,
					// 	weight: size.weight,
					// }))
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

			// router.replace("/admin/products");
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
								setBundleProducts={setBundleProducts}
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
							addSize={addSize}
							updateSize={updateSize}
							removeSize={removeSize}
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

function BasicInformation({
	formData,
	handleInputChange,
	categories = [],
}: {
	formData: any;
	handleInputChange: (field: string, value: string) => void;
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
											e.target.value
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
								handleInputChange("categoryId", value)
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

function ProductTypeSelector({
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

function ProductSizes({
	sizes,
	addSize,
	updateSize,
	removeSize,
}: {
	sizes: ProductSize[];
	addSize: () => void;
	updateSize: (
		index: number,
		field: keyof ProductSize,
		value: string | number
	) => void;
	removeSize: (index: number) => void;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					Размеры, кол-во и вес
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addSize}
					>
						<Plus className="h-4 w-4 mr-2" />
						Добавить размер
					</Button>
				</CardTitle>
				<CardDescription>
					⚠️ Даже если изделие не является комплектом вы должны
					обязательно создать хотябы один размер так как только здесь
					можно задать вес изделия будь то серьги или что угодно! ⚠️
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{sizes.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>
							Пока не добавлено ни одного размера. Нажмите
							«Добавить размер», чтобы начать.
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
										placeholder="e.g., 2, 3, 4"
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
