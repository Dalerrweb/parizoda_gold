"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import type { Category } from "@/app/types";
import { uploadFiles } from "@/lib/utils";
import ProductBundleTable from "../../create/product-bundle-table";

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

interface Product {
	id: number;
	sku: string;
	name: string;
	description?: string;
	price: number;
	weight?: number;
	type: string;
	categoryId: number;
	preciousMetal?: string;
	images: ProductImage[];
	sizes: ProductSize[];
	childBundles: any[];
	parentBundle: any[];
	category: Category;
}

export default function EditProductPage() {
	const router = useRouter();
	const params = useParams();
	const productId = params.id as string;

	const [loading, setLoading] = useState(true);
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
	const [originalProduct, setOriginalProduct] = useState<Product | null>(
		null
	);

	// Load product data
	useEffect(() => {
		const fetchProduct = async () => {
			if (!productId) return;

			try {
				setLoading(true);
				const response = await fetch(`/api/admin/product/${productId}`);

				if (!response.ok) {
					throw new Error("Failed to fetch product");
				}

				const product: Product = await response.json();
				console.log({ product });

				setOriginalProduct(product);

				// Populate form data
				setFormData({
					sku: product.sku,
					name: product.name,
					description: product.description || "",
					price: product.price.toString(),
					weight: product.weight?.toString() || "",
					type: product.type,
					childBundles: (product?.parentBundle as any) || [],
					preciousMetal: product.preciousMetal || "",
					categoryId: product.categoryId.toString(),
				});

				// Set images
				setImages(product.images || []);

				// Set sizes
				setSizes(product.sizes || []);

				// Set bundle products if it's a bundle
				if (
					product.type === "BUNDLE" &&
					product.childBundles?.length > 0
				) {
					setBundleProducts({
						selectedProducts: product.childBundles,
						totalBundlePrice: product.childBundles.reduce(
							(total: number, bundle: any) => {
								return total + (bundle.product?.price || 0);
							},
							0
						),
						totalBundleWeight: product.childBundles.reduce(
							(total: number, bundle: any) => {
								return total + (bundle.product?.weight || 0);
							},
							0
						),
					});
				}
			} catch (error) {
				console.error("Error fetching product:", error);
				toast.error("Failed to load product. Please try again.");
				router.push("/admin/products");
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [productId, router]);

	// Load categories
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

	// Update form data when bundle products change
	useEffect(() => {
		if (bundleProducts) {
			setFormData((prev) => ({
				...prev,
				weight:
					bundleProducts?.totalBundleWeight?.toString() ||
					prev.weight,
				childBundles: bundleProducts?.selectedProducts || [],
			}));
		}
	}, [bundleProducts]);

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
			// Prepare images for upload
			const newImages = images.filter((img) => img.file);
			const existingImages = images.filter((img) => !img.file);

			// Upload new images
			const uploadedImages =
				newImages.length > 0 ? await uploadFiles(newImages) : [];

			// Combine existing and new images
			const allImages = [
				...existingImages.map((img) => ({ url: img.url, id: img.id })),
				...uploadedImages,
			];

			// Update product
			const response = await fetch(`/api/admin/product/${productId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					price: Number.parseFloat(formData.price),
					weight: formData.weight
						? Number.parseFloat(formData.weight)
						: null,
					categoryId: Number.parseInt(formData.categoryId),
					images: allImages,
					sizes: sizes.map((size) => ({
						value: size.value,
						quantity: size.quantity,
					})),
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || "Failed to update product"
				);
			}

			toast.success("Product updated successfully!");
			router.replace("/admin/products");
		} catch (error) {
			console.error("Error updating product:", error);
			toast.error("Failed to update product. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (
			!confirm(
				"Are you sure you want to delete this product? This action cannot be undone."
			)
		) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/product/${productId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete product");
			}

			toast.success("Product deleted successfully!");
			router.replace("/admin/products");
		} catch (error) {
			console.error("Error deleting product:", error);
			toast.error("Failed to delete product. Please try again.");
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
								Back to Products
							</Button>
						</Link>
						<h1 className="text-lg font-semibold">Edit Product</h1>
					</div>
				</header>
				<div className="flex-1 flex items-center justify-center">
					<div className="flex items-center gap-2">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span>Loading product...</span>
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
							Back to Products
						</Button>
					</Link>
					<h1 className="text-lg font-semibold">Edit Product</h1>
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
								Edit Product
							</h2>
							<p className="text-muted-foreground">
								Update product information and settings
							</p>
							{originalProduct && (
								<Badge variant="outline" className="mt-2">
									ID: {originalProduct.id} • SKU:{" "}
									{originalProduct.sku}
								</Badge>
							)}
						</div>
						<div className="flex space-x-2">
							<Button type="button" variant="outline">
								<Eye className="mr-2 h-4 w-4" />
								Preview
							</Button>
							<Button
								type="button"
								variant="destructive"
								onClick={handleDelete}
							>
								Delete
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								<Save className="mr-2 h-4 w-4" />
								{isSubmitting
									? "Updating..."
									: "Update Product"}
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
								initialSelectedProducts={
									originalProduct?.parentBundle || []
								}
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
					<div className="flex justify-between pt-6">
						<Button
							type="button"
							variant="destructive"
							onClick={handleDelete}
						>
							Delete Product
						</Button>
						<div className="flex space-x-4">
							<Link href="/admin/products">
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</Link>
							<Button type="submit" disabled={isSubmitting}>
								<Save className="mr-2 h-4 w-4" />
								{isSubmitting
									? "Updating Product..."
									: "Update Product"}
							</Button>
						</div>
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
								step="0.01"
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
