"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createBanner } from "@/lib/banner-actions";
import { ImageUploader } from "./image-uploader";

interface AddBannerDialogProps {
	maxPosition: number;
}

export function AddBannerDialog({ maxPosition }: AddBannerDialogProps) {
	const [open, setOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState("");
	const [isActive, setIsActive] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (formData: FormData) => {
		if (!imageUrl) {
			alert("Please upload an image");
			return;
		}

		setIsSubmitting(true);

		// Add the image URL to form data
		formData.set("imageUrl", imageUrl);
		formData.set("isActive", isActive.toString());

		try {
			await createBanner(formData);
			setOpen(false);
			setImageUrl("");
			setIsActive(true);
		} catch (error) {
			console.error("Error creating banner:", error);
			alert("Failed to create banner");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					Add Banner
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Banner</DialogTitle>
				</DialogHeader>
				<form action={handleSubmit} className="space-y-4">
					<ImageUploader onImageUploaded={setImageUrl} name="add" />

					<div>
						<Label htmlFor="link">Link (Optional)</Label>
						<Input
							id="link"
							name="link"
							placeholder="https://example.com/destination"
						/>
					</div>

					<div>
						<Label htmlFor="position">Position</Label>
						<Input
							id="position"
							name="position"
							type="number"
							defaultValue={maxPosition + 1}
							min="1"
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							id="isActive"
							checked={isActive}
							onCheckedChange={setIsActive}
						/>
						<Label htmlFor="isActive">Active</Label>
					</div>

					<div className="flex justify-end space-x-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Adding..." : "Add Banner"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
