import { HostState } from "./types.js"
import { actionize } from "./utils/actionize.js"

const hostState: HostState = {
	session: undefined,
	clients: new Map(),
	tracks: new Map(),
}

const hostActions = actionize({
	startCall: (state) => async () => {},
	endCall: (state) => async () => {},
})

export { hostState, hostActions }
