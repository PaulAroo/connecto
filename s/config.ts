const isDevMode =
	window.location.host.startsWith("localhost") ||
	window.location.host.startsWith("192.")

export const baseURL = isDevMode
	? "localhost:8080/"
	: "paularoo.github.io/connecto/"
