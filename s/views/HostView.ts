import { html } from "@benev/slate"

import { app } from "../context/app.js"
import { SessionInfo } from "../types.js"
import { createCallSession } from "../utils/createCallSession.js"

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
	const [connectedPeers, setConnectedPeers] = use.state(0)

	// error handling has to happen here, or at the point when the connection is made
	const startCallSession = async () => {
		const session = await createCallSession({
			audioElement,
			signalServerUrl,
			setConnectedPeers,
		})
		setSessionDetails(session)
	}

	const stopCallSession = () => {
		const { localStream, peerConnection, terminateSession } = use.context
		// host has to handle closing all peer connections
		peerConnection?.close()
		localStream?.getTracks().forEach((track) => {
			track.stop()
		})
		terminateSession()
		setSessionDetails(undefined)
	}

	const renderSessionDetails = () => {
		if (sessionDetails) {
			return html`
				<p>session ID: ${sessionDetails.id}</p>
				<p>session label: ${sessionDetails.label}</p>
				<p>
					link to join session:
					<a href=${`${location.href}?session=${sessionDetails.id}`}
						>${`${location.href}?session=${sessionDetails.id}`}</a
					>
				</p>
				<p>Peers connected: ${connectedPeers}</p>
			`
		}
	}

	return html`
		<div>Host a call session</div>
		<button @click=${startCallSession} .disabled=${!!sessionDetails}>
			start
		</button>
		<button @click=${stopCallSession} .disabled=${!sessionDetails}>stop</button>
		${renderSessionDetails()}
	`
})

// TODO
//    handle web socket timeout
