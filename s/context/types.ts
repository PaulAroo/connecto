import { Client, SessionInfo } from "../types.js"

export interface HostActions {
	endCall: (localStream: MediaStream) => Promise<void>
	addClient: (id: string) => void
	removeClient: (id: string) => void
	updateClientConnectionState: (client: Client) => void
	startCall: (audioElement: HTMLAudioElement, localStream: MediaStream) => Promise<void>
}

export interface ClientActions {
	joinCall: (
		sessionId: string,
		audioElement: HTMLAudioElement
	) => Promise<string>
	disconnect: () => void
}

export interface Actions {
	host: HostActions
	client: ClientActions
}

export interface Streams {
	remote: MediaStream
	local: MediaStream | undefined
}

export interface State {
	session: SessionInfo | undefined
	clients: Client[]
}
