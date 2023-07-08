import { API } from "./../shared";

/**
 * Convert the gotten URL from the API to a valid URL
 * @param url
 * @returns
 */
export const getValidURL = (url: string) => {
	if (url.startsWith("http")) return url;
	return API.audioHost + url;
};
