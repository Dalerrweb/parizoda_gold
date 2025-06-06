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
import { Category } from "@/app/types";
import { uploadFiles } from "@/lib/utils";
import ProductBundleTable from "./product-bundle-table";
import { useRouter } from "next/navigation";

// Enums based on your Prisma schema
const ProductTypes = {
	SINGLE: "Single Product",
	BUNDLE: "Product Bundle",
};

interface ProductSize {
	id?: number;
	value: string;
	quantity: number;
}

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
		price: "",
		weight: "",
		type: "SINGLE",
		childBundles: [],
		preciousMetal: "",
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
			weight: bundleProducts?.totalBundleWeight || 0,
			childBundles: bundleProducts?.selectedProducts || [],
		}));
	}, [bundleProducts]);

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
		setSizes((prev) => [...prev, { value: "", quantity: 0 }]);
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
			const productResponse = await fetch("/api/admin/product", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					price: parseFloat(formData.price),
					weight: formData.weight
						? parseFloat(formData.weight)
						: null,
					categoryId: Number.parseInt(formData.categoryId),
					images: [], // Пока без изображений
					sizes: sizes.map((size) => ({
						value: size.value,
						quantity: size.quantity,
					})),
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

			router.replace("/admin/products");
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
							Back to Products
						</Button>
					</Link>
					<h1 className="text-lg font-semibold">Create Product</h1>
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
								Create New Product
							</h2>
							<p className="text-muted-foreground">
								Add a new product to your inventory
							</p>
						</div>
						<div className="flex space-x-2">
							<Button type="button" variant="outline">
								<Eye className="mr-2 h-4 w-4" />
								Preview
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								<Save className="mr-2 h-4 w-4" />
								{isSubmitting
									? "Creating..."
									: "Create Product"}
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
							{/* <ProductBundle
								setBundleProducts={setBundleProducts}
							/> */}
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
					<ProductSizes
						sizes={sizes}
						addSize={addSize}
						updateSize={updateSize}
						removeSize={removeSize}
					/>

					{/* Form Actions */}
					<div className="flex justify-end space-x-4 pt-6">
						<Link href="/admin/products">
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</Link>
						<Button type="submit" disabled={isSubmitting}>
							<Save className="mr-2 h-4 w-4" />
							{isSubmitting
								? "Creating Product..."
								: "Create Product"}
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
					<div className="space-y-2">
						<Label htmlFor="price">Price *</Label>
						<div className="relative">
							<span className="absolute left-3 top-2.5 text-muted-foreground">
								$
							</span>
							<Input
								id="price"
								type="number"
								// step="0.01"
								placeholder="0"
								className="pl-8"
								value={formData.price}
								onChange={(e) =>
									handleInputChange("price", e.target.value)
								}
								required
							/>
						</div>
					</div>
					<div className="space-y-2">
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
					</div>
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
	categories?: Category[];
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
				{/* {isPreciousMetalCategory && ( */}
				{/* <div className="space-y-2">
										<Label htmlFor="preciousMetal">
											Precious Metal
										</Label>
										<Select
											value={formData.preciousMetal}
											onValueChange={(value) =>
												handleInputChange(
													"preciousMetal",
													value
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select metal type" />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(MetalTypes).map(
													([key, label]) => (
														<SelectItem
															key={key}
															value={key}
														>
															{label}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div> */}
				{/* )} */}
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
					Product Sizes & Stock
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
					Manage different sizes and their stock levels
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{sizes.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>
							No sizes added yet. Click "Add Size" to get started.
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
										Size
									</Label>
									<Input
										id={`size-${index}`}
										placeholder="e.g., S, M, L, XL"
										value={size.value}
										onChange={(e) =>
											updateSize(
												index,
												"value",
												e.target.value
											)
										}
									/>
								</div>
								<div className="flex-1">
									<Label htmlFor={`stock-${index}`}>
										Stock
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
