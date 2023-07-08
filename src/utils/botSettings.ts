import { bot } from "./../bot";

export function initCommands() {
	bot.setMyCommands([
		{
			command: "start",
			description: "عرض القائمة الرئيسية",
		},
		{
			command: "ayah",
			description: "البحث عن آية",
		},
		{
			command: "surah",
			description: "البحث عن سورة",
		},
	]);
}
