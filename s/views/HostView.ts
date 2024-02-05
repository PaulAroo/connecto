import { html } from "@benev/slate"

import { app } from "../context/app.js"
import { SessionInfo } from "../types.js"
import { createCallSession } from "../utils/createCallSession.js"

interface HostviewProps {
	audioElement: HTMLAudioElement
	signalServerUrl: string
}

export const HostView = app.light_view((use) => (props: HostviewProps) => {
	use.name("host-view")

	const { audioElement, signalServerUrl } = props
	const [sessionDetails, setSessionDetails] = use.state<
		SessionInfo | undefined
	>(undefined)

	const startCallSession = async () => {
		const { session, localStream, peerConnection } = await createCallSession({
			audioElement,
			signalServerUrl,
		})
		setSessionDetails(session)
		use.context.session = session
		use.context.localStream = localStream
		use.context.peerConnection = peerConnection
	}

	const stopCallSession = () => {
		const { localStream, peerConnection } = use.context
		peerConnection?.close()
		localStream?.getTracks().forEach((track) => {
			track.stop()
		})
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
