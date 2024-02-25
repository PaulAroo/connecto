import { SessionInfo } from "../types.js"

export interface HostActions {
	startCall: (audioElement: HTMLAudioElement) => Promise<void>
	endCall: () => Promise<void>
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
	noOfClients: number
	session: SessionInfo | undefined
}
