import type TelegramBot from "node-telegram-bot-api";

import { bot } from "@/bot";
import { _callbacks, getCurrentUser, setCurrentAction, state } from "@/shared";

import settings from "@/config/settings.json";
import createButtonsList from "@/helpers/createButtonsList";
import { removeKeyboard } from "@/helpers/removeKeyboard";

import { handleMessage } from "./handleMessage";

const chapters: SurahInfo[] = settings.chapters;
const buttons = createButtonsList({
	input: chapters,
	columnsPerRow: 3,
});

// TODO: Show Surahs menu to choose one
export const chooseSurah = (msg: TelegramBot.Message) => {
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	const text =
		currentUser.METHOD === "AYAH"
			? "اختر السورة التي منها الآية"
			: "اختر السورة";

	bot.sendMessage(userId, text, {
		parse_mode: "HTML",
		reply_to_message_id: msg.message_id,
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
			value: "IS_CHOOSING_SURAH",
		})
	);
};

// TODO: Check if the chose surah exists
export const checkSurah = (msg: TelegramBot.Message) => {
	const text = msg.text;
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	const currentSurah = chapters.find((item) => item.name_arabic === text);

	if (!currentSurah) {
		bot.sendMessage(userId, "عذرًا، لم أفهم الرسالة، رجاءً اختر اسم السورة");
	} else {
		if (currentUser.METHOD === "AYAH") {
			state.dispatch(
				setCurrentAction({ userId, key: "currentAction", value: "CHOOSE_AYAH" })
			);
		} else if (currentUser.METHOD === "SURAH") {
			state.dispatch(
				setCurrentAction({ userId, key: "currentAction", value: "SHOW_SURAH" })
			);
		}

		state.dispatch(
			setCurrentAction({ userId, key: "surah", value: currentSurah.id })
		);
		handleMessage(msg);
	}

	return Boolean(currentSurah);
};

// TODO: Show the chose surah
export const showSurah = (msg: TelegramBot.Message) => {
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	const surahInfo = chapters.find(
		(item) => item.id === currentUser.surah
	) as SurahInfo;

	state.dispatch(
		setCurrentAction({ userId, key: "surah", value: surahInfo.id })
	);

	const text = `سورة <b>${surahInfo.name_arabic}</b>.
سورة ${surahInfo.revelation_place === "makkah" ? "مكية" : "مدنية"}
ترتيب نزولها: ${surahInfo.revelation_order}.

عدد آياتها: ${surahInfo.verses_count}
${
	surahInfo.pages[0] === surahInfo.pages[1]
		? `صفحة ${surahInfo.pages[0]}`
		: `من صفحة ${surahInfo.pages[0]} إلى صفحة ${surahInfo.pages[1]}`
}`;

	removeKeyboard(msg);
	bot.sendMessage(userId, text, {
		parse_mode: "HTML",
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "استماع 🎧",
						callback_data: _callbacks.chooseReciter,
					},
				],
			],
		},
	});
};
