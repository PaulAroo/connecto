import { standardRtcConfig } from "../config.js"
import { ClientActions, ClientState } from "./types.js"

const clientState: ClientState = {
	session: undefined,
	peer: new RTCPeerConnection(standardRtcConfig),
}

const clientActions: ClientActions = {
	startCall: async () => {},
	endCall: async () => {},
}

export { clientState, clientActions }
