import { Nexus, Context, css } from "@benev/slate"
import { getSessionIdFromUrl } from "../utils/getSessionIdFromUrl.js"

export interface SessionInfo {
	id: string
	label: string
	discoverable: boolean
}

export const app = new Nexus(
	new (class extends Context {
		theme = css`
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
		`
		sessionId = getSessionIdFromUrl()
		session: SessionInfo | undefined
		localStream: MediaStream | undefined
		peerConnection: RTCPeerConnection | undefined
	})()
)
