import type TelegramBot from "node-telegram-bot-api";

import { bot } from "@/bot";
import { _callbacks, API, getCurrentUser } from "@/shared";

import settings from "@/config/settings.json";
import { getValidURL } from "@/helpers/getValidURL";
import { removeKeyboard } from "@/helpers/removeKeyboard";

export const listenToSurah = async (msg: TelegramBot.Message) => {
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);
	const surah = settings.chapters.find((s) => s.id === currentUser.surah);

	const api = API.reciteSurah(currentUser.reciterId, currentUser.surah);

	// const reciters = settings.recitations;

	// reciters.forEach(async (recitation) => {
	// 	const api = API.reciteSurah(recitation.id, user.surah);
	// 	const response = await fetch(api);
	// 	const data = (await response.json()) as Recitation;
	// 	const file = getValidURL(data.audio_file.audio_url);
	// 	bot.sendAudio(622497099, file, {
	// 		caption: recitation.translated_name.name
	// 	});
	// });
	// return;

	const res = await fetch(api);

	if (!res.ok) {
		bot.sendMessage(
			userId,
			"عذرًا نواجه مشكلة في تنفيذ الطلب. يرجى البدء من جديد. اضغط هنا /start"
		);
		removeKeyboard(msg);

		return;
	}

	const data = (await res.json()) as Recitation;
	const file = getValidURL(data.audio_file.audio_url);

	if (!data.audio_file.audio_url) return;

	bot.sendChatAction(userId, "upload_voice", {});

	try {
		await bot.sendAudio(
			userId,
			file,
			{
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
			},
			{
				filename: `${surah?.name_arabic}.mp3`,
			}
		);
	} catch (err) {
		bot.sendMessage(
			userId,
			`
يمكنك الاستماع وتحميل الملف الصوتي <a href="${file}">من هنا</a>
		`,
			{
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
			}
		);
	} finally {
		removeKeyboard(msg);
	}
};

export const listenToAyah = async (msg: TelegramBot.Message) => {
	const userId = msg.chat.id;
	const currentUser = getCurrentUser(userId);

	const api = API.reciteAyah(
		currentUser.reciterId,
		currentUser.surah,
		currentUser.ayah
	);

	const res = await fetch(api);

	if (!res.ok) {
		bot.sendMessage(
			userId,
			"عذرًا نواجه مشكلة في تنفيذ الطلب. يرجى البدء من جديد. اضغط هنا /start"
		);

		removeKeyboard(msg);
		return;
	}

	const data = (await res.json()) as VerseRecitation;
	const file = getValidURL(data.audio_files[0].url);

	if (!file) return;

	try {
		bot.sendAudio(
			userId,
			file,
			{
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
			},
			{
				filename: `${data.audio_files[0].verse_key}.mp3`,
			}
		);
	} catch (err) {
		bot.sendMessage(
			userId,
			`
يمكنك الاستماع وتحميل الملف الصوتي <a href="${file}">من هنا</a>
		`,
			{
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
			}
		);
	} finally {
		removeKeyboard(msg);
	}
};
