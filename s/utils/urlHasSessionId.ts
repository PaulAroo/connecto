export function urlHasSessionId() {
	const searchParams = new URLSearchParams(location.search)
	return !searchParams.has("session")
}
