import { html } from "@benev/slate"
import { SessionInfo, app } from "../context/app.js"
import { createCallSession } from "../utils/createCallSession.js"
import { joinCallSession } from "../utils/joinCallSession.js"

const signalServerUrl = "wss://sparrow-rtc.benevolent.games/"

export const ConnectTo = app.shadow_component((use) => {
	const isHost = !use.context.sessionId

	const audioElement = use.once(() => {
		const audio = document.createElement("audio")
		audio.autoplay = true
		return audio
	})

	const [sessionDetails, setSessionDetails] = use.state<
		SessionInfo | undefined
	>(undefined)

	use.mount(() => {
		const sessionId = use.context.sessionId
		if (sessionId) {
			joinCallSession({
				sessionId,
				audioElement,
				signalServerUrl,
			})
		}
		return () => {}
	})

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
					<a href=${`${location.href}?session=${sessionDetails.id}`}
						>${`${location.href}?session=${sessionDetails.id}`}</a
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

	return html` ${audioElement}
		<div>first shadow component</div>
		${isHost ? renderAsHost() : renderAsClient()}`
})
