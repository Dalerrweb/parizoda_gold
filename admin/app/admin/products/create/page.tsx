"use client";

import type React from "react";

import { useState } from "react";
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

// Enums based on your Prisma schema
const ProductTypes = {
	SINGLE: "Single Product",
	BUNDLE: "Product Bundle",
	VARIANT: "Product Variant",
};

const MetalTypes = {
	GOLD: "Gold",
	SILVER: "Silver",
	PLATINUM: "Platinum",
	PALLADIUM: "Palladium",
	COPPER: "Copper",
	BRONZE: "Bronze",
};

// Mock categories
const mockCategories = [
	{ id: 1, name: "Electronics" },
	{ id: 2, name: "Clothing" },
	{ id: 3, name: "Jewelry" },
	{ id: 4, name: "Home & Garden" },
];

interface ProductSize {
	id?: number;
	size: string;
	stock: number;
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
		preciousMetal: "",
		categoryId: "",
	});

	const [images, setImages] = useState<ProductImage[]>([]);
	const [sizes, setSizes] = useState<ProductSize[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

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
		setSizes((prev) => [...prev, { size: "", stock: 0 }]);
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

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));

		console.log("Product Data:", {
			...formData,
			price: Number.parseInt(formData.price) * 100, // Convert to cents
			weight: formData.weight ? Number.parseFloat(formData.weight) : null,
			categoryId: Number.parseInt(formData.categoryId),
			images,
			sizes,
		});

		setIsSubmitting(false);
		// Redirect to products page or show success message
	};

	const isPreciousMetalCategory = formData.categoryId === "3"; // Jewelry category

	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<div className="flex flex-1 items-center gap-2">
					<Link href="/products">
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
											handleInputChange(
												"sku",
												e.target.value
											)
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
											handleInputChange(
												"name",
												e.target.value
											)
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
										handleInputChange(
											"description",
											e.target.value
										)
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
											step="0.01"
											placeholder="0.00"
											className="pl-8"
											value={formData.price}
											onChange={(e) =>
												handleInputChange(
													"price",
													e.target.value
												)
											}
											required
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="weight">
										Weight (grams)
									</Label>
									<Input
										id="weight"
										type="number"
										step="0.1"
										placeholder="0.0"
										value={formData.weight}
										onChange={(e) =>
											handleInputChange(
												"weight",
												e.target.value
											)
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="category">Category *</Label>
									<Select
										value={formData.categoryId}
										onValueChange={(value) =>
											handleInputChange(
												"categoryId",
												value
											)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{mockCategories.map((category) => (
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

					{/* Product Type & Metal */}
					<Card>
						<CardHeader>
							<CardTitle>Product Classification</CardTitle>
							<CardDescription>
								Product type and material specifications
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
								</div>
								{isPreciousMetalCategory && (
									<div className="space-y-2">
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
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Product Images */}
					<Card>
						<CardHeader>
							<CardTitle>Product Images</CardTitle>
							<CardDescription>
								Upload product photos (first image will be the
								main image)
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{images.map((image, index) => (
									<div key={index} className="relative group">
										<img
											src={
												image.url || "/placeholder.svg"
											}
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

					{/* Product Sizes */}
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
										No sizes added yet. Click "Add Size" to
										get started.
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
												<Label
													htmlFor={`size-${index}`}
												>
													Size
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
												<Label
													htmlFor={`stock-${index}`}
												>
													Stock
												</Label>
												<Input
													id={`stock-${index}`}
													type="number"
													min="0"
													placeholder="0"
													value={size.stock}
													onChange={(e) =>
														updateSize(
															index,
															"stock",
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
												onClick={() =>
													removeSize(index)
												}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Form Actions */}
					<div className="flex justify-end space-x-4 pt-6">
						<Link href="/products">
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
