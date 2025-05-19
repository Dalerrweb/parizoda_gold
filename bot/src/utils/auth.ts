export async function authenticateUser() {
	const initData = window.Telegram.WebApp.initData;

	try {
		const res = await fetch("http://localhost:3000/api/auth/telegram", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ initData }),
		});

		if (!res.ok) {
			throw new Error(res.statusText);
		}

		const { token } = await res.json();
		localStorage.setItem("token", token); // или sessionStorage
	} catch (e: any) {
		console.error("Ошибка авторизации", e);
		return e.message;
	}
}
