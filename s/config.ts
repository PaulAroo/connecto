const isDevMode =
	window.location.host.startsWith("localhost") ||
	window.location.host.startsWith("192.")

export const baseURL = isDevMode
	? "http://localhost:8080/"
	: "https://paularoo.github.io/connecto/"
