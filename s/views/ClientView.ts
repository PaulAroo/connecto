import { html } from "@benev/slate"

import { app } from "../context/app.js"
import { SessionInfo } from "../types.js"
import { joinCallSession } from "../utils/joinCallSession.js"
interface ClientViewProps {
	sessionId: string
	signalServerUrl: string
	audioElement: HTMLAudioElement
}

export const ClientView = app.light_view((use) => (props: ClientViewProps) => {
	use.name("client-view")
	const { sessionId, audioElement, signalServerUrl } = props

	const [clientId, setClientId] = use.state("")
	const [sessionDetails, setSessionDetails] = use.state<
		SessionInfo | undefined
	>(undefined)

	use.mount(() => {
		;(async () => {
			const { clientId, sessionInfo } = await joinCallSession({
				sessionId,
				audioElement,
				signalServerUrl,
				handleDisconnect,
			})

			setClientId(clientId)
			setSessionDetails(sessionInfo)
		})()

		return () => {}
	})

	function handleDisconnect() {
		console.log("called")
		const { localStream, peerConnection } = use.context
		peerConnection?.close()
		localStream?.getTracks().forEach((track) => {
			track.stop()
		})
		setSessionDetails(undefined)
	}

	return html`
		${!!sessionDetails
			? html`
					<div>Joined a call session</div>
					<p>Client ID: ${clientId}</p>
					<p>Session label: ${sessionDetails?.label}</p>
			  `
			: undefined}
	`
})

// TODO
//  handle invalid session ID error
