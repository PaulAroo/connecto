export function handleClientConnectionStateChange({
	peer,
	handleDisconnect,
}: {
	peer: RTCPeerConnection
	handleDisconnect: () => void
}) {
	return () => {
		const isDisconnected =
			peer.connectionState === "failed" ||
			peer.connectionState === "closed" ||
			peer.connectionState === "disconnected"

		if (isDisconnected) {
			handleDisconnect()
		}
	}
}
