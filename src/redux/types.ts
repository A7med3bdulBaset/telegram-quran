import type TelegramBot from "node-telegram-bot-api";

type Actions = Record<Action, Action>;
export const _actions: Actions = {
	STARTING: "STARTING",
	CHOOSE_SURAH: "CHOOSE_SURAH",
	IS_CHOOSING_SURAH: "IS_CHOOSING_SURAH",
	SHOW_SURAH: "SHOW_SURAH",
	CHOOSE_RECITER: "CHOOSE_RECITER",
	IS_CHOOSING_RECITER: "IS_CHOOSING_RECITER",
	LISTEN_TO_SURAH: "LISTEN_TO_SURAH",
	CHOOSE_AYAH: "CHOOSE_AYAH",
	IS_CHOOSING_AYAH: "IS_CHOOSING_AYAH",
	LISTEN_TO_AYAH: "LISTEN_TO_AYAH",
	SHOW_AYAH: "SHOW_AYAH",
	TAFSIR_AYAH: "TAFSIR_AYAH",
};

type Callbacks = { [key: string]: Callback };
export const _callbacks: Callbacks = {
	index: "INDEX",
	ayah: "AYAH",
	surah: "SURAH",
	chooseReciter: "CHOOSE_RECITER",
	tafsirAyah: "TAFSIR_AYAH",
};

export type Users = Record<
	string,
	{
		METHOD: "SURAH" | "AYAH" | "";
		currentAction: Action;
		ayah: number;
		surah: number;
		reciterId: number;
		sampleMessage: TelegramBot.Message;
	}
>;
