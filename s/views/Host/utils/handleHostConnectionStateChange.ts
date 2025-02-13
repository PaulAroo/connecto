import { watch } from "@benev/slate"
import { Peer } from "../../../types.js"
import { app } from "../../../context/app.js"

export const handleHostConnectionStateChange = (
	clientId: string,
	connState: RTCPeerConnectionState
) => {
	return () => {
		const shouldUpdate =
			connState === "connecting" ||
			connState === "connected" ||
			connState === "disconnected"

		const shouldDisconnect =
			connState === "failed" || connState === "closed"

		if (shouldUpdate) {
			app.context.actions.host.updateClientConnectionState({
				id: clientId,
				connectionState: connState,
			})
		}

		if (shouldDisconnect) {
			app.context.actions.host.removeClient(clientId)
		}
	}
}
