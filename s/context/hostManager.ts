import { HostActions, HostState } from "./types.js"

const hostState: HostState = {
	session: undefined,
	clients: new Map(),
}

const hostActions: HostActions = {
	startCall: async () => {},
	endCall: async () => {},
}

export { hostState, hostActions }
