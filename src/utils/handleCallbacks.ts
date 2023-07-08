import { bot } from "@/bot";
import {
	_callbacks,
	getCurrentUser,
	resetActions,
	setCurrentAction,
} from "@/shared";
import state from "@/redux/store";

import { handleMessage } from "./handleMessage";

export function listenToCallbacks() {
	bot.on("callback_query", (query) => {
		const callback: Callback = query.data as Callback;
		const userId = query.from.id;
		const currentUser = getCurrentUser(userId);

		switch (callback) {
			case _callbacks.index:
				state.dispatch(resetActions({ userId, action: "STARTING" }));
				handleMessage(currentUser.sampleMessage);
				break;

			case _callbacks.ayah:
				state.dispatch(
					setCurrentAction({ userId, key: "METHOD", value: "AYAH" })
				);
				break;

			case _callbacks.surah:
				state.dispatch(
					setCurrentAction({ userId, key: "METHOD", value: "SURAH" })
				);
				break;

			case _callbacks.chooseReciter:
				state.dispatch(
					setCurrentAction({
						userId,
						key: "currentAction",
						value: "CHOOSE_RECITER",
					})
				);
				break;

			case _callbacks.tafsirAyah:
				state.dispatch(
					setCurrentAction({
						userId,
						key: "currentAction",
						value: "TAFSIR_AYAH",
					})
				);
				break;
		}

		if (callback === _callbacks.ayah || callback === _callbacks.surah) {
			state.dispatch(resetActions({ userId, action: "CHOOSE_SURAH" }));
			handleMessage(currentUser.sampleMessage);
			return;
		}
	});
}
