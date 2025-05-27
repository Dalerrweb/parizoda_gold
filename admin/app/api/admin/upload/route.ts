import { type NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

const gcsKeyBuffer = Buffer.from(process.env.GCS_KEY_BASE64 || "", "base64");
const gcsKeyJson = JSON.parse(gcsKeyBuffer.toString());

const storage = new Storage({
	credentials: gcsKeyJson,
	projectId: process.env.GCS_PROJECT_ID || "",
});
const bucket = storage.bucket("example_1_daler");

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file" }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const gcsFileName = `${Date.now()}-${file.name}`;

		const fileStream = bucket.file(gcsFileName).createWriteStream({
			metadata: {
				contentType: file.type,
			},
			resumable: false,
			public: true,
		});

		const readable = Readable.from(buffer);

		// Use pipeline for better error handling
		await pipeline(readable, fileStream);

		const publicUrl = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
		return NextResponse.json({ url: publicUrl });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{
				error: "Upload failed",
				details:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
