import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import {
	collection,
	doc,
	getDocs,
	getFirestore,
	setDoc,
} from "firebase/firestore";

dotenv.config();

const {
	FB_API_KEY,
	FB_AUTH_DOMAIN,
	FB_PROJECT_ID,
	FB_STORAGE_BUCKET,
	FB_MESSAGING_SENDER_ID,
	FB_APP_ID,
} = process.env;

const firebaseConfig = {
	apiKey: FB_API_KEY,
	authDomain: FB_AUTH_DOMAIN,
	projectId: FB_PROJECT_ID,
	storageBucket: FB_STORAGE_BUCKET,
	messagingSenderId: FB_MESSAGING_SENDER_ID,
	appId: FB_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const saveUserToDatabase = async (user: User) => {
	const docRef = doc(db, "users", user.chatId.toString());

	try {
		await setDoc(docRef, user);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
};

export const getAllUsers = async () => {
	const usersCol = collection(db, "users");
	const usersSnapshot = await getDocs(usersCol);
	const users: Record<string, User> = {};

	usersSnapshot.forEach((doc) => {
		users[doc.id] = doc.data() as User;
	});

	return users;
};
