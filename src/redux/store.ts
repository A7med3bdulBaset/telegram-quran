import { configureStore } from "@reduxjs/toolkit";

import { getAllUsers as getAllUsersFromDB } from "@/helpers/database";

import { reducer } from "./slice";

const state = configureStore({
	reducer,
});

getAllUsersFromDB().then((users) => {
	state.dispatch({
		type: "getAllUsers",
		payload: users,
	});
});

export default state;
