import { html } from "@benev/slate"
import { app } from "../context/app.js"
import { joinCallSession } from "../utils/joinCallSession.js"
import { SessionInfo } from "../types.js"

interface ClientViewProps {
	audioElement: HTMLAudioElement
	signalServerUrl: string
}

export const ClientView = app.light_view((use) => (props: ClientViewProps) => {
	use.name("client-view")
	const { audioElement, signalServerUrl } = props

	const [clientId, setClientId] = use.state("")
	const [sessionDetails, setSessionDetails] = use.state<
		SessionInfo | undefined
	>(undefined)

	use.mount(() => {
		const sessionId = use.context.sessionId
		if (sessionId) {
			;(async () => {
				const { clientId, sessionInfo } = await joinCallSession({
					sessionId,
					audioElement,
					signalServerUrl,
				})

				setClientId(clientId)
				setSessionDetails(sessionInfo)
				use.context.session = sessionInfo
			})()
		}

		return () => {}
	})

	return html`
		<div>Joined a call session</div>
		<p>Client ID: ${clientId}</p>
		<p>Session label: ${sessionDetails?.label}</p>
	`
})

// TODO
//  handle invalid session ID error
