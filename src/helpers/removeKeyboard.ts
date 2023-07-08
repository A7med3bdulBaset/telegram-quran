import TelegramBot from "node-telegram-bot-api";

import { bot } from "./../bot";

export const removeKeyboard = async (msg: TelegramBot.Message) => {
	const message = await bot.sendMessage(msg.chat.id, "...", {
		reply_markup: {
			keyboard: [
				[
					{
						text: "القائمة الرئيسية",
					},
				],
			],
			resize_keyboard: true,
		},
	});

	bot.deleteMessage(message.chat.id, message.message_id);
};
