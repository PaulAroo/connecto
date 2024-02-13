import { Signal } from "@benev/slate"
import { PeerConnection } from "../../../types.js"

export const handlePeerConnectionStateChange = ({
	peer,
	tracks,
	clientId,
	peerConnections,
}: {
	clientId: string
	peer: RTCPeerConnection
	tracks: Map<string, MediaStreamTrack>
	peerConnections: Signal<Map<string, PeerConnection>>
}) => {
	return () => {
		const isDisconnected =
			peer.connectionState === "failed" ||
			peer.connectionState === "closed" ||
			peer.connectionState === "disconnected"

		if (isDisconnected) {
			peerConnections.value.delete(clientId)
			tracks.delete(clientId)
		}

		peerConnections.publish()
	}
}
