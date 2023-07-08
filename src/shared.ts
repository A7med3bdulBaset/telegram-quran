/** Shared variables */

import state from "./redux/store";
import { _callbacks } from "./redux/types";

/** API breakpoints */

const rootApi = "https://api.quran.com/api/v4/";

export const API = {
	/** api.quran.com */
	root: rootApi,
	/** Get a recitation of a surah by reciter id and surah id */
	reciteSurah: (reciterId: number, surahId: number) =>
		`${rootApi}chapter_recitations/${reciterId || 12}/${surahId}`,
	/** Get a text of a verse by surah id and verse id */
	ayahText: (surahId: number, verseId: number) =>
		`${rootApi}quran/verses/imlaei?verse_key=${surahId}:${verseId}`,
	/** Get a recitation of a verse by reciter id, surah id and verse id */
	reciteAyah: (reciterId: number, surahId: number, verseId: number) => {
		return `${rootApi}recitations/${reciterId}/by_ayah/${surahId}:${verseId}`;
	},
	/** audio.qurancdn.com */
	audioHost: "https://audio.qurancdn.com/",
	/** Get a tafsir of a verse by surah id and verse id */
	tafsirAyah: (surahId: number, verseId: number) =>
		`https://api.qurancdn.com/api/v4/tafsirs/16/by_ayah/${surahId}:${verseId}?locale=ar`,
	// 16 is the id of altafsir almoysser
};

const users = state.getState();
const getCurrentUser = (userId: number) => users[userId.toString()] || null;

export { state, users, getCurrentUser, _callbacks };
export { setCurrentAction, resetActions, createNewUser } from "./redux/slice";
