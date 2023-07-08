import TelegramBot from "node-telegram-bot-api";

import { bot } from "@/bot";
import { _callbacks, API, getCurrentUser, setCurrentAction } from "@/shared";
import state from "@/redux/store";

import settings from "@/config/settings.json";
import { createVersesButtonsList } from "@/helpers/createButtonsList";
import { removeKeyboard } from "@/helpers/removeKeyboard";

import { handleMessage } from "./handleMessage";

const chapters: SurahInfo[] = settings.chapters;

export const chooseAyah = (msg: TelegramBot.Message) => {
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	const versesCount = chapters.find(
		(item) => item.id === currentUser.surah
	)!.verses_count;

	const versesArray: number[] = [];

	for (let i = 1; i <= versesCount; i++) {
		versesArray.push(i);
	}

	const buttons = createVersesButtonsList({
		input: versesArray,
		columnsPerRow: 4,
	});

	bot.sendMessage(userId, "رجاءً اختر رقم الآية", {
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
			value: "IS_CHOOSING_AYAH",
		})
	);
};

export const checkAyah = (msg: TelegramBot.Message) => {
	const text = msg.text;
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	const verses_count = chapters.find(
		(item) => item.id === currentUser.surah
	)!.verses_count;

	const isFound: boolean =
		parseInt(text || "") > 0 && parseInt(text || "") <= verses_count;

	if (!isFound) {
		bot.sendMessage(
			userId,
			`رقم الآية غير صحيح. يرجى اختيار رقم آية من 1 إلى ${verses_count}`
		);
	} else {
		state.dispatch(
			setCurrentAction({ userId, key: "currentAction", value: "SHOW_AYAH" })
		);

		state.dispatch(
			setCurrentAction({ userId, key: "ayah", value: parseInt(text!) })
		);
		handleMessage(msg);
	}

	return isFound;
};

const getAyah = async (
	surahId: number,
	ayahId: number,
	msg: TelegramBot.Message
) => {
	const res = await fetch(API.ayahText(surahId, ayahId));

	if (!res.ok) {
		bot.sendMessage(
			msg.chat.id,
			"عذرًا نواجه مشكلة في تنفيذ الطلب. يرجى البدء من جديد. اضغط هنا /start"
		);

		removeKeyboard(msg);

		return;
	}
	const data = (await res.json()) as VerseText;

	return data;
};

export const showAyah = async (msg: TelegramBot.Message) => {
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	const surah = chapters[currentUser.surah - 1];

	const verse = await getAyah(currentUser.surah, currentUser.ayah, msg);

	const text = `
قال الله تعالى: "<b>${verse?.verses[0].text_imlaei}</b>".

سورة: <b>${surah?.name_arabic}</b>.
رقم الآية: <b>${verse?.verses[0].verse_key.split(":")[1]}</b>
`;

	removeKeyboard(msg);
	bot.sendChatAction(userId, "typing");

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
				[
					{
						text: "تفسير 📚",
						callback_data: _callbacks.tafsirAyah,
					},
				],
			],
		},
	});
};

const getTafsir = async (
	surahId: number,
	ayahId: number,
	msg: TelegramBot.Message
) => {
	const res = await fetch(API.tafsirAyah(surahId, ayahId));

	if (!res.ok) {
		bot.sendMessage(
			msg.chat.id,
			"عذرًا نواجه مشكلة في تنفيذ الطلب. يرجى البدء من جديد. اضغط هنا /start",
			{
				reply_markup: {
					keyboard: [
						[
							{
								text: "القائمة الرئيسية",
							},
						],
					],
				},
			}
		);

		return;
	}
	return (await res.json()) as TafsirAyah;
};

export const tafsirAyah = async (msg: TelegramBot.Message) => {
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	const tafsir = await getTafsir(currentUser.surah, currentUser.ayah, msg);

	const text = `${tafsir?.tafsir.text}`;

	try {
		bot.sendMessage(userId, text, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "القائمة الرئيسية",
							callback_data: _callbacks.index,
						},
					],
				],
			},
		});
	} catch (err) {
		// IF Message is too long
		// devide text into chunks
		const chunks = text.match(/.{1,4000}/g);
		if (!chunks) return;

		chunks.slice(0, 5).forEach((chunk, index) => {
			bot.sendMessage(userId, `${index + 1} - ${chunk}`, {
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: "القائمة الرئيسية",
								callback_data: _callbacks.index,
							},
						],
					],
				},
			});
		});
	}
};
