// import { Action } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TelegramBot from "node-telegram-bot-api";

import { _actions, Users } from "./types";

export const users: Users = {
	"0": {
		METHOD: "",
		currentAction: _actions.STARTING,
		ayah: 0,
		surah: 0,
		reciterId: 0,
		sampleMessage: {
			message_id: 0,
			chat: {
				id: 0,
				first_name: "",
				username: "",
				type: "private",
			},
			date: 0,
		},
	},
};

const slice = createSlice({
	initialState: users,
	name: "users",
	reducers: {
		setCurrentAction: (
			state,
			action: PayloadAction<{
				userId: number;
				key: keyof Users["0"];
				value: Users["0"][keyof Users["0"]];
			}>
		) => {
			const userId = action.payload.userId.toString();

			state[userId] = {
				...state[userId],
				[action.payload.key]: action.payload.value,
			};

			if (action.payload.key === "METHOD") {
				state[userId] = {
					...state[userId],
					METHOD: action.payload.value as "" | "SURAH" | "AYAH",
					currentAction: "STARTING",
					surah: 0,
					ayah: 0,
				};
			}
		},
		createNewUser: (
			state,
			action: PayloadAction<{
				userId: number;
				sampleMessage: TelegramBot.Message;
			}>
		) => {
			state[action.payload.userId] = {
				METHOD: "",
				currentAction: _actions.STARTING,
				ayah: 0,
				surah: 0,
				reciterId: 0,
				sampleMessage: action.payload.sampleMessage,
			};
		},
		resetActions: (
			state,
			action: PayloadAction<{
				userId: number;
				action?: Action;
			}>
		) => {
			state[action.payload.userId] = {
				...state[action.payload.userId],
				currentAction: action.payload.action || _actions.STARTING,
				ayah: 0,
				surah: 0,
				reciterId: 0,
			};
		},
	},
});

export const {
	actions: { setCurrentAction, resetActions, createNewUser },
	reducer,
} = slice;
