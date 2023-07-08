import type TelegramBot from "node-telegram-bot-api";

import { bot } from "@/bot";
import { getCurrentUser, setCurrentAction } from "@/shared";
import state from "@/redux/store";

import settings from "@/config/settings.json";

import { handleMessage } from "./handleMessage";

const reciters = settings.recitations;
const buttons = reciters.map((reciter) => [
	{ text: reciter.translated_name.name },
]);

export function chooseReciter(msg: TelegramBot.Message) {
	const userId = msg.chat.id;

	bot.sendMessage(msg.chat.id, "من فضلك اختر القارئ", {
		reply_markup: {
			keyboard: [
				[{ text: "القائمة الرئيسية" }],
				...buttons,
				[{ text: "القائمة الرئيسية" }],
			],
		},
	});

	state.dispatch(
		setCurrentAction({
			userId,
			key: "currentAction",
			value: "IS_CHOOSING_RECITER",
		})
	);
}

export const checkReciter = (msg: TelegramBot.Message) => {
	const text = msg.text;
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	const currentReciter = reciters.find(
		(item) => item.translated_name.name === text
	);

	if (currentReciter?.id || text === "1") {
		state.dispatch(
			setCurrentAction({
				userId,
				key: "currentAction",
				value:
					currentUser.METHOD === "SURAH" ? "LISTEN_TO_SURAH" : "LISTEN_TO_AYAH",
			})
		);
		state.dispatch(
			setCurrentAction({
				userId,
				key: "reciterId",
				value: currentReciter?.id || 12,
			})
		);
		handleMessage(msg);
	} else {
		bot.sendMessage(
			userId,
			"عذرًا، لم أفهم الرسالة، رجاءً اختر القارئ أو أرسل 1"
		);
	}

	return Boolean(currentReciter);
};
