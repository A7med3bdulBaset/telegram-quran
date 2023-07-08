import type TelegramBot from "node-telegram-bot-api";

import { getCurrentUser } from "@/shared";
import { _actions } from "@/redux/types";

import { listenToAyah, listenToSurah } from "./callApi";
import { checkAyah, chooseAyah, showAyah, tafsirAyah } from "./chooseAyah";
import { checkReciter, chooseReciter } from "./chooseReciter";
import { checkSurah, chooseSurah, showSurah } from "./chooseSurah";
import { onStart } from "./onStart";

export const handleMessage = (msg: TelegramBot.Message) => {
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	switch (currentUser.METHOD) {
		// Start the bot OR wrong input
		case "":
		default:
			onStart(msg);
			break;

		case "SURAH": {
			// User decided to choose surah
			switch (currentUser.currentAction) {
				case _actions.CHOOSE_SURAH:
					if (currentUser.surah === 0) chooseSurah(msg);
					break;

				case _actions.IS_CHOOSING_SURAH:
					checkSurah(msg);
					break;

				case _actions.SHOW_SURAH:
					showSurah(msg);
					break;

				case _actions.CHOOSE_RECITER:
					if (currentUser.reciterId === 0) chooseReciter(msg);
					break;

				case _actions.IS_CHOOSING_RECITER:
					checkReciter(msg);
					break;

				case _actions.LISTEN_TO_SURAH:
					listenToSurah(msg);
					break;
			}
			break;
		}

		case "AYAH": {
			// User decided to choose Ayah
			switch (currentUser.currentAction) {
				case _actions.CHOOSE_SURAH:
					if (!currentUser.surah) chooseSurah(msg);
					break;

				case _actions.IS_CHOOSING_SURAH:
					checkSurah(msg);
					break;

				case _actions.CHOOSE_AYAH:
					if (!currentUser.ayah) chooseAyah(msg);
					break;

				case _actions.IS_CHOOSING_AYAH:
					checkAyah(msg);
					break;

				case _actions.SHOW_AYAH:
					showAyah(msg);
					break;

				case _actions.CHOOSE_RECITER:
					chooseReciter(msg);
					break;

				case _actions.IS_CHOOSING_RECITER:
					checkReciter(msg);
					break;

				case _actions.LISTEN_TO_AYAH:
					listenToAyah(msg);
					break;

				case _actions.TAFSIR_AYAH:
					tafsirAyah(msg);
					break;
			}
			break;
		}
	}
};
