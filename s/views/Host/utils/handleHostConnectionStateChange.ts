import { watch } from "@benev/slate"
import { Peer } from "../../../types.js"
import { app } from "../../../context/app.js"

export const handleHostConnectionStateChange = (
	clientId: string,
	peer: RTCPeerConnection
) => {
	return () => {
		const shouldUpdate =
			peer.connectionState === "connecting" ||
			peer.connectionState === "connected" ||
			peer.connectionState === "disconnected"

		const shouldDisconnect =
			peer.connectionState === "failed" || peer.connectionState === "closed"

		if (shouldUpdate) {
			app.context.actions.host.updateClientConnectionState({
				id: clientId,
				connectionState: peer.connectionState,
			})
		}

		if (shouldDisconnect) {
			app.context.actions.host.removeClient(clientId)
		}
	}
}
