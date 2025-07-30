import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		return NextResponse.json("completeOrder", { status: 201 });
	} catch (error) {
		console.error("Error creating order:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to create order",
			},
			{ status: 500 }
		);
	}
}
