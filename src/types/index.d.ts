declare type Action =
	| "STARTING"
	| "CHOOSE_SURAH"
	| "SHOW_SURAH"
	| "IS_CHOOSING_SURAH"
	| "CHOOSE_RECITER"
	| "IS_CHOOSING_RECITER"
	| "LISTEN_TO_SURAH"
	| "CHOOSE_AYAH"
	| "IS_CHOOSING_AYAH"
	| "SHOW_AYAH"
	| "LISTEN_TO_AYAH"
	| "TAFSIR_AYAH";

declare type Callback =
	| "INDEX"
	| "AYAH"
	| "SURAH"
	| "CHOOSE_RECITER"
	| "TAFSIR_AYAH";

declare type UserChoises = {
	METHOD: "SURAH" | "AYAH" | "";
	currentAction: Action;
	ayah: number;
	surah: number;
	reciterId: number;
};

type Message = {
	message_id: number;
	chat: {
		id: number;
	};
	date: number;
};

declare type User = {
	chatId: number;
	firstName: string | null;
	lastName: string | null;
	username: string;
	userChoices: UserChoises;
	sampleMessage: Message;
};

declare interface SurahInfo {
	id: number;
	revelation_place: string;
	revelation_order: number;
	bismillah_pre: boolean;
	name_simple: string;
	name_complex: string;
	name_arabic: string;
	verses_count: number;
	pages: number[];
	translated_name: {
		language_name: string;
		name: string;
	};
}

declare interface Reciter {
	id: number;
	reciter_name: string;
	style: string;
	translated_name: {
		name: string;
		language_name: string;
	};
}

// TODO: API data returned
declare type Recitation = {
	audio_file: {
		id: number;
		chapter_id: number;
		file_size: any;
		format: string;
		audio_url: string;
	};
};

declare type VerseRecitation = {
	audio_files: [
		{
			verse_key: string;
			url: string;
		},
	];
	pagination: {
		per_page: number;
		current_page: number;
		next_page: any;
		total_pages: number;
		total_records: number;
	};
};

declare type VerseText = {
	verses: [
		{
			id: number;
			verse_key: string;
			text_imlaei: string;
		},
	];
	meta: {
		filters: {
			verse_key: string;
		};
	};
};

declare type TafsirAyah = {
	tafsir: {
		verses: {
			[key: string]: {
				id: number;
			};
		};
		resource_id: number;
		resource_name: string;
		language_id: number;
		slug: string;
		translated_name: {
			name: string;
			language_name: string;
		};
		text: string;
	};
};
