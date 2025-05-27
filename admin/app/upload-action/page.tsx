"use client";

import { useState } from "react";

export default function UploadPage() {
	const [imageUrl, setImageUrl] = useState("");

	const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const fileInput = form.elements.namedItem("file") as HTMLInputElement;
		const file = fileInput?.files?.[0];

		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		const res = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});
		console.log({ res });

		const data = await res.json();

		console.log({ data });

		setImageUrl(data.url);
	};

	return (
		<form onSubmit={handleUpload}>
			<input type="file" name="file" accept="image/*" />
			<button type="submit">Загрузить</button>
			{imageUrl && <img src={imageUrl} alt="Загруженное изображение" />}
		</form>
	);
}
