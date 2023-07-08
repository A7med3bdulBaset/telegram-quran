import { writeFileSync } from "fs";
import TelegramBot from "node-telegram-bot-api";

import {
	createNewUser,
	getCurrentUser,
	resetActions,
	setCurrentAction,
	state,
} from "@/shared";
import { _actions } from "@/redux/actions";

import { handleMessage } from "@/utils/handleMessage";
import { saveUserToDatabase } from "@/helpers/database";

const { TELEGRAM_TOKEN, APP_URL } = process.env;
if (!TELEGRAM_TOKEN || !APP_URL) {
	throw new Error("Please set TELEGRAM_TOKEN and APP_URL in .env");
}

export const bot = new TelegramBot(TELEGRAM_TOKEN!, {
	polling: true,
});
// TODO: Set webhook
bot.setWebHook(`${APP_URL}/bot${TELEGRAM_TOKEN}`);

bot.on("message", (msg) => {
	if (!msg.text) return;
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	//* IF the user is not in the database
	if (!currentUser) {
		state.dispatch(createNewUser({ userId, sampleMessage: msg }));

		//* Create a new user in Firestore
		saveUserToDatabase({
			chatId: msg.chat.id,
			firstName: msg.chat.first_name || null,
			lastName: msg.chat.last_name || null,
			username: msg.chat.username || "",
			userChoices: {
				ayah: 0,
				METHOD: "",
				currentAction: "STARTING",
				surah: 0,
				reciterId: 12,
			},
			sampleMessage: msg,
		});
	}

	writeFileSync("logs.json", JSON.stringify(state.getState(), null, 2));

	//* NOW the user is in the database

	//* IF the user clicked on a menu button
	if (/\/start|القائمة الرئيسية/.test(msg.text)) {
		state.dispatch(resetActions({ userId, action: _actions.STARTING }));
		state.dispatch(setCurrentAction({ userId, key: "METHOD", value: "" }));

		handleMessage(msg);
		return;
	}

	if (/\/surah/.test(msg.text)) {
		state.dispatch(setCurrentAction({ userId, key: "METHOD", value: "SURAH" }));
		state.dispatch(
			setCurrentAction({ userId, key: "currentAction", value: "CHOOSE_SURAH" })
		);
		handleMessage(msg);
		return;
	}

	if (/\/ayah/.test(msg.text)) {
		state.dispatch(setCurrentAction({ userId, key: "METHOD", value: "AYAH" }));
		state.dispatch(
			setCurrentAction({ userId, key: "currentAction", value: "CHOOSE_AYAH" })
		);
		handleMessage(msg);
		return;
	}

	//* Here the user is not clicking on a menu button
	// but he is going through the bot's flow
	handleMessage(msg);
});
