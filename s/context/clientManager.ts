import { ClientState } from "./types.js"
import { actionize } from "./utils/actionize.js"
import { standardRtcConfig } from "../config.js"

const clientState: ClientState = {
	session: undefined,
	peer: new RTCPeerConnection(standardRtcConfig),
}

const clientActions = actionize({
	startCall: (state) => async () => {},
	endCall: (state) => async () => {},
})

export { clientState, clientActions }
