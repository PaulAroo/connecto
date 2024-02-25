import { watch } from "@benev/slate"
import { Peer } from "../../../types.js"
import { app } from "../../../context/app.js"

export const handleHostConnectionStateChange = (
	clientId: string,
	peer: RTCPeerConnection,
	clients: Map<string, Peer>,
	tracks: Map<string, MediaStreamTrack>
) => {
	return () => {
		const isDisconnected =
			peer.connectionState === "failed" ||
			peer.connectionState === "closed" ||
			peer.connectionState === "disconnected"

		if (isDisconnected) {
			clients.delete(clientId)
			tracks.delete(clientId)
		}

		app.context.state.noOfClients = clients.size
		watch.dispatch()
	}
}
