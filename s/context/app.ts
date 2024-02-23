import { Nexus, Context, css, watch } from "@benev/slate"

interface CLientState {
	localStream: MediaStream | undefined
	peer: RTCPeerConnection | undefined
}

interface HostState {
	localStream: MediaStream | undefined
	terminateSession: () => void
}

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
		client = <CLientState>{}
		host = <HostState>{}
	})()
)
