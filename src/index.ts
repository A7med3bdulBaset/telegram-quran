import dotenv from "dotenv";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

import { bot } from "@/bot";

import { initCommands } from "@/utils/botSettings";
import { listenToCallbacks } from "@/utils/handleCallbacks";

dotenv.config();

initCommands();
listenToCallbacks();

export const telegramBot = onRequest((request, response) => {
	logger.info("Hello logs!", { structuredData: true });
	bot.processUpdate(request.body);
	response.sendStatus(200);
});
