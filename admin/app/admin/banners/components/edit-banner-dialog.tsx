"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
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
import { updateBanner } from "@/lib/banner-actions";
import { ImageUploader } from "./image-uploader";
import type { Banner } from "../types";

interface EditBannerDialogProps {
	banner: Banner;
}

export function EditBannerDialog({ banner }: EditBannerDialogProps) {
	const [open, setOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState(banner.imageUrl);
	const [isActive, setIsActive] = useState(banner.isActive);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (formData: FormData) => {
		if (!imageUrl) {
			alert("Please upload an image");
			return;
		}

		setIsSubmitting(true);

		// Add the image URL and other data to form data
		formData.set("id", banner.id.toString());
		formData.set("imageUrl", imageUrl);
		formData.set("isActive", isActive.toString());

		try {
			await updateBanner(formData);
			setOpen(false);
		} catch (error) {
			console.error("Error updating banner:", error);
			alert("Failed to update banner");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Edit className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Banner</DialogTitle>
				</DialogHeader>
				<form action={handleSubmit} className="space-y-4">
					<ImageUploader
						onImageUploaded={setImageUrl}
						currentImage={banner.imageUrl}
						name={`edit-${banner.id}`}
					/>

					<div>
						<Label htmlFor="edit-link">Link (Optional)</Label>
						<Input
							id="edit-link"
							name="link"
							defaultValue={banner.link || ""}
							placeholder="https://example.com/destination"
						/>
					</div>

					<div>
						<Label htmlFor="edit-position">Position</Label>
						<Input
							id="edit-position"
							name="position"
							type="number"
							defaultValue={banner.position}
							min="1"
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							id="edit-isActive"
							checked={isActive}
							onCheckedChange={setIsActive}
						/>
						<Label htmlFor="edit-isActive">Active</Label>
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
							{isSubmitting ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
