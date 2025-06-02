"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function createBanner(formData: FormData) {
	const imageUrl = formData.get("imageUrl") as string;
	const link = formData.get("link") as string;
	const isActive = formData.get("isActive") === "true";
	const position = Number.parseInt(formData.get("position") as string);

	if (!imageUrl) {
		throw new Error("Image URL is required");
	}

	try {
		await prisma.banner.create({
			data: {
				imageUrl,
				link: link || null,
				isActive,
				position,
			},
		});

		revalidatePath("/admin/banners");
	} catch (error) {
		console.error("Error creating banner:", error);
		throw new Error("Failed to create banner");
	}
}

export async function updateBanner(formData: FormData) {
	const id = Number.parseInt(formData.get("id") as string);
	const imageUrl = formData.get("imageUrl") as string;
	const link = formData.get("link") as string;
	const isActive = formData.get("isActive") === "true";
	const position = Number.parseInt(formData.get("position") as string);

	if (!imageUrl) {
		throw new Error("Image URL is required");
	}

	try {
		await prisma.banner.update({
			where: { id },
			data: {
				imageUrl,
				link: link || null,
				isActive,
				position,
			},
		});

		revalidatePath("/admin/banners");
	} catch (error) {
		console.error("Error updating banner:", error);
		throw new Error("Failed to update banner");
	}
}

export async function deleteBanner(formData: FormData) {
	const id = Number.parseInt(formData.get("id") as string);

	try {
		await prisma.banner.delete({
			where: { id },
		});

		revalidatePath("/admin/banners");
	} catch (error) {
		console.error("Error deleting banner:", error);
		throw new Error("Failed to delete banner");
	}
}

export async function toggleBannerStatus(formData: FormData) {
	const id = Number.parseInt(formData.get("id") as string);

	try {
		const banner = await prisma.banner.findUnique({
			where: { id },
		});

		if (!banner) {
			throw new Error("Banner not found");
		}

		await prisma.banner.update({
			where: { id },
			data: {
				isActive: !banner.isActive,
			},
		});

		revalidatePath("/admin/banners");
	} catch (error) {
		console.error("Error toggling banner status:", error);
		throw new Error("Failed to toggle banner status");
	}
}

export async function moveBannerPosition(formData: FormData) {
	const id = Number.parseInt(formData.get("id") as string);
	const direction = formData.get("direction") as "up" | "down";

	try {
		const banner = await prisma.banner.findUnique({
			where: { id },
		});

		if (!banner) {
			throw new Error("Banner not found");
		}

		const newPosition =
			direction === "up" ? banner.position - 1 : banner.position + 1;

		// Find the banner at the target position
		const swapBanner = await prisma.banner.findFirst({
			where: { position: newPosition },
		});

		if (swapBanner) {
			// Swap positions using a transaction
			await prisma.$transaction([
				prisma.banner.update({
					where: { id: banner.id },
					data: { position: newPosition },
				}),
				prisma.banner.update({
					where: { id: swapBanner.id },
					data: { position: banner.position },
				}),
			]);
		}

		revalidatePath("/admin/banners");
	} catch (error) {
		console.error("Error moving banner position:", error);
		throw new Error("Failed to move banner position");
	}
}
