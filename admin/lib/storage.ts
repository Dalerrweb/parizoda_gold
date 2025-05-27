export const UploadToGcs = async (file: File) => {
	if (!file) throw new Error("No file provided");
	if (file.size < 1) throw new Error("File is empty");

	const buffer = await file.arrayBuffer();
	const storage = new Storage();
	await storage
		.bucket("example_1_daler")
		.file(file.name)
		.save(Buffer.from(buffer));

	return true;
};
