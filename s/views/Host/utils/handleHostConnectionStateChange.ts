import { Signal, watch } from "@benev/slate"
import { Peer } from "../../../types.js"

export const handleHostConnectionStateChange = ({
	peer,
	tracks,
	clientId,
	peerConnections,
}: {
	clientId: string
	peer: RTCPeerConnection
	tracks: Map<string, MediaStreamTrack>
	peerConnections: Map<string, Peer>
}) => {
	return () => {
		const isDisconnected =
			peer.connectionState === "failed" ||
			peer.connectionState === "closed" ||
			peer.connectionState === "disconnected"

		if (isDisconnected) {
			peerConnections.delete(clientId)
			tracks.delete(clientId)
		}

		watch.dispatch()
	}
}
