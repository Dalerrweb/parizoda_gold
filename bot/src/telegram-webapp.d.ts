// telegram-webapp.d.ts
export {};

declare global {
	interface Window {
		Telegram: {
			WebApp: any; // Или можешь указать более точную типизацию, см. ниже
		};
	}
}
