export async function sendOtpToSuperadmin(code: string) {
	const botToken = process.env.TG_ADMIN_BOT_TOKEN;
	const chatId = process.env.TG_SUPERADMIN_ID;

	const res = await fetch(
		`https://api.telegram.org/bot${botToken}/sendMessage`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: chatId,
				text: `Код подтверждения: ${code}`,
			}),
		}
	);

	if (!res.ok) {
		throw new Error("Не удалось отправить код");
	}
}
