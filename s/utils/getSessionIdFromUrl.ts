export function getSessionIdFromUrl() {
	const searchParams = new URLSearchParams(location.search)
	return searchParams.get("session")
}
