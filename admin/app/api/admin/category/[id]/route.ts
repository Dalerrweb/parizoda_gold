import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const parsedId = Number.parseInt(id);

		if (isNaN(parsedId)) {
			return NextResponse.json(
				{ error: "Invalid category ID" },
				{ status: 400 }
			);
		}

		const category = await prisma.category.findUnique({
			where: { id: parsedId },
			include: {
				_count: {
					select: {
						products: true,
					},
				},
			},
		});

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(category);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch category" },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: idParam } = await params;
		const id = Number.parseInt(idParam);
		const body = await req.json();

		if (isNaN(id)) {
			return NextResponse.json(
				{ error: "Invalid category ID" },
				{ status: 400 }
			);
		}

		if (!body.name || body.name.trim() === "") {
			return NextResponse.json(
				{ error: "Category name is required" },
				{ status: 400 }
			);
		}

		if (!body.imageUrl || body.imageUrl.trim() === "") {
			return NextResponse.json(
				{ error: "Category image URL is required" },
				{ status: 400 }
			);
		}

		const category = await prisma.category.update({
			where: { id },
			data: {
				name: body.name.trim(),
				imageUrl: body.imageUrl.trim(),
			},
		});

		return NextResponse.json({
			message: "Category updated successfully",
			category,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update category" },
			{ status: 500 }
		);
	}
}

// DELETE - Delete a category
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: idParam } = await params;
		const id = Number.parseInt(idParam);

		if (isNaN(id)) {
			return NextResponse.json(
				{ error: "Invalid category ID" },
				{ status: 400 }
			);
		}

		// Check if category has products
		const categoryWithProducts = await prisma.category.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						products: true,
					},
				},
			},
		});

		if (!categoryWithProducts) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}

		if (categoryWithProducts._count.products > 0) {
			return NextResponse.json(
				{ error: "Cannot delete category with associated products" },
				{ status: 400 }
			);
		}

		await prisma.category.delete({
			where: { id },
		});

		return NextResponse.json({
			message: "Category deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to delete category" },
			{ status: 500 }
		);
	}
}
