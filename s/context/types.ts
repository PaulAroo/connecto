import { PeerConnection, SessionInfo } from "../types.js"
import { Session } from "sparrow-rtc"

export type ClientState = {
	session: SessionInfo | undefined
	peer: RTCPeerConnection
}

export type HostState = {
	session: Session | undefined
	clients: Map<string, PeerConnection>
	tracks: Map<string, MediaStreamTrack>
}

export type HostActions = {
	startCall: () => Promise<void>
	endCall: () => Promise<void>
}

export type State = {
	streams: {
		local: MediaStream | undefined
		remote: MediaStream
	}
	host: HostState
	client: ClientState
}
