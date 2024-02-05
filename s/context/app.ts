import { Nexus, Context, css } from "@benev/slate"

export const app = new Nexus(
	new (class extends Context {
		theme = css`
			*,
			*::after,
			*::before {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
		`

		terminateSession = () => {}
		localStream: MediaStream | undefined
		peerConnection: RTCPeerConnection | undefined
	})()
)
