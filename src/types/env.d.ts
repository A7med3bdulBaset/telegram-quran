declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production";
		TELEGRAM_TOKEN: string | undefined;
		APP_URL: string | undefined;
		// Firebase
		FB_API_KEY: string | undefined;
		FB_AUTH_DOMAIN: string | undefined;
		FB_PROJECT_ID: string | undefined;
		FB_STORAGE_BUCKET: string | undefined;
		FB_MESSAGING_SENDER_ID: string | undefined;
		FB_APP_ID: string | undefined;
	}
}
