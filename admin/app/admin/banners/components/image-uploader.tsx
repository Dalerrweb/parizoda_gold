"use client";

import type React from "react";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
	onImageUploaded: (imageUrl: string) => void;
	currentImage?: string;
	name: string;
}

export function ImageUploader({
	onImageUploaded,
	currentImage,
	name,
}: ImageUploaderProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		currentImage || null
	);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			setError("Please select an image file");
			return;
		}

		// Create a preview
		const objectUrl = URL.createObjectURL(file);
		setPreviewUrl(objectUrl);
		setError(null);

		// Upload the file
		try {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/admin/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to upload image");
			}

			const data = await response.json();
			onImageUploaded(data.url); // Assuming the API returns { url: "path/to/image" }
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to upload image"
			);
			console.error("Upload error:", err);
		} finally {
			setIsUploading(false);
		}
	};

	const clearImage = () => {
		setPreviewUrl(null);
		onImageUploaded("");
	};

	return (
		<div className="space-y-4">
			<Label htmlFor={`banner-image-${name}`}>Banner Image</Label>

			{previewUrl ? (
				<div className="relative">
					<img
						src={previewUrl || "/placeholder.svg"}
						alt="Banner preview"
						className="h-40 w-full object-contain border rounded-md"
					/>
					<Button
						type="button"
						variant="destructive"
						size="icon"
						className="absolute top-2 right-2 h-8 w-8"
						onClick={clearImage}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50">
					<Upload className="h-10 w-10 text-gray-400 mb-2" />
					<p className="text-sm text-gray-500 mb-2">
						Click to upload or drag and drop
					</p>
					<p className="text-xs text-gray-400">
						PNG, JPG, GIF up to 10MB
					</p>
					<Input
						id={`banner-image-${name}`}
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						disabled={isUploading}
						className="hidden"
					/>
					<Label htmlFor={`banner-image-${name}`} className="mt-4">
						{/* <Button
							type="button"
							variant="outline"
							disabled={isUploading}
						> */}
						{isUploading ? "Uploading..." : "Select Image"}
						{/* </Button> */}
					</Label>
				</div>
			)}

			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}
