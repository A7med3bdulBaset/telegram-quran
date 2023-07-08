import type TelegramBot from "node-telegram-bot-api";

import { bot } from "@/bot";
import { _callbacks, setCurrentAction } from "@/shared";
import state from "@/redux/store";

import settings from "@/config/settings.json";

export const onStart = (msg: TelegramBot.Message) => {
	const userId = msg.chat.id;
	state.dispatch(
		setCurrentAction({ userId, key: "sampleMessage", value: msg })
	);

	bot.sendMessage(
		msg.chat.id,
		`مرحبا <b>${
			msg.chat.first_name || "أخي"
		}</b>\n\nيمكنك اختيار آية أو سورة، لمعرفة تفسيرها أو الاستماع إليها بصوت القارئ الذي تختاره\nلا تنس مشاركة البوت مع أصدقائك \n\n@${
			settings.botUsername
		}\n\n<code>https://t.me/${settings.botUsername}</code>`,
		{
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "اختيار آية",
							callback_data: _callbacks.ayah,
						},
					],
					[
						{
							text: "اختيار سورة كاملة",
							callback_data: _callbacks.surah,
						},
					],
				],
			},
		}
	);
};
