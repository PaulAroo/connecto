import { html } from "@benev/slate"
import { SessionInfo, app } from "../context/app.js"
import { createCallSession } from "../utils/createCallSession.js"

const signalServerUrl = "wss://sparrow-rtc.benevolent.games/"

export const CalleeSlate = app.shadow_component((use) => {
	const isHost = use.context.isHost
	const [sessionDetails, setSessionDetails] = use.state<
		SessionInfo | undefined
	>(undefined)

	const startCallSession = async () => {
		const audioElement = use.shadow.querySelector("audio")
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

		setSessionDetails(undefined)
		use.context.session = undefined
		use.context.localStream = undefined
		use.context.peerConnection = undefined
	}

	const renderSessionDetails = () => {
		if (sessionDetails) {
			return html`
				<p>session ID: ${sessionDetails.id}</p>
				<p>session label: ${sessionDetails.label}</p>
				<p>
					link to join session:
					<a href=${`http://localhost:8080/?session=${sessionDetails.id}`}
						>${`http://localhost:8080/?session=${sessionDetails.id}`}</a
					>
				</p>
			`
		}
	}

	const renderAsHost = () => {
		return html`
			<div>intialized as a host</div>
			<button @click=${startCallSession} .disabled=${!!sessionDetails}>
				start a call session
			</button>
			<button @click=${stopCallSession} .disabled=${!sessionDetails}>
				stop
			</button>
			${renderSessionDetails()}
		`
	}

	const renderAsClient = () => {
		return html` <div>intialized as a client</div> `
	}

	return html` <audio autoplay></audio>
		<div>first shadow component</div>
		${isHost ? renderAsHost() : renderAsClient()}`
})
