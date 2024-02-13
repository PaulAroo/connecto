import { html } from "@benev/slate"

import { app } from "../../context/app.js"
import { PeerConnection, SessionInfo } from "../../types.js"
import { createCallSession } from "./utils/createCallSession.js"
import { renderSessionDetails } from "./utils/renderSessionDetails.js"

interface HostViewProps {
	audioElement: HTMLAudioElement
	signalServerUrl: string
}

export const HostView = app.light_view((use) => (props: HostViewProps) => {
	use.name("host-view")

	const { audioElement, signalServerUrl } = props
	const [sessionDetails, setSessionDetails] = use.state<
		SessionInfo | undefined
	>(undefined)
	const peerConnections = use.signal(new Map<string, PeerConnection>())

	const startCallSession = async () => {
		try {
			const session = await createCallSession({
				audioElement,
				signalServerUrl,
				peerConnections,
			})
			setSessionDetails(session)
		} catch (error) {
			console.log(error)
		}
	}

	const stopCallSession = () => {
		const { localStream, terminateSession } = use.context.host
		peerConnections.value.forEach(({ peer }) => {
			peer.close()
		})
		localStream?.getTracks().forEach((track) => {
			track.stop()
		})
		terminateSession()
		setSessionDetails(undefined)
	}

	return html`
		<div>Host a call session</div>
		<button @click=${startCallSession} .disabled=${!!sessionDetails}>
			start
		</button>
		<button @click=${stopCallSession} .disabled=${!sessionDetails}>stop</button>
		${renderSessionDetails(sessionDetails, peerConnections.value)}
	`
})
