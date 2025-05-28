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
		const files = formData.getAll("files") as File[]; // Изменено на получение массива файлов

		if (!files || files.length === 0) {
			return NextResponse.json(
				{ error: "No files uploaded" },
				{ status: 400 }
			);
		}

		const uploadPromises = files.map(async (file) => {
			const buffer = Buffer.from(await file.arrayBuffer());
			const gcsFileName = `${Date.now()}-${Math.random()
				.toString(36)
				.substring(2, 10)}-${file.name}`; // Добавлен рандомный компонент

			const fileStream = bucket.file(gcsFileName).createWriteStream({
				metadata: {
					contentType: file.type,
				},
				resumable: false,
				public: true,
			});

			const readable = Readable.from(buffer);
			await pipeline(readable, fileStream);

			return {
				url: `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`,
			};
		});

		const urls = await Promise.all(uploadPromises);
		return NextResponse.json({ urls });
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
