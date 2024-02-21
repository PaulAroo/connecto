import { PeerConnection, SessionInfo } from "../types.js"
import { Session } from "sparrow-rtc"

export type ClientState = {
	session: SessionInfo | undefined
	peer: RTCPeerConnection
}

export type ClientActions = {}

export type HostActions = {
	startCall: () => Promise<void>
	endCall: () => Promise<void>
}

export type HostState = {
	session: Session | undefined
	clients: Map<string, PeerConnection>
}

export type State = {
	streams: {
		local: MediaStream | undefined
		remote: MediaStream | undefined
	}
	host: HostState
	client: ClientState
}

export type Actions = {
	host: HostActions
	client: ClientActions
}
