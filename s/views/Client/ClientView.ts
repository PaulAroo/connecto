import { html } from "@benev/slate"

import { baseURL } from "../../config.js"
import { app } from "../../context/app.js"
import { SessionInfo } from "../../types.js"
import { Spinner } from "../spinner/Spinner.js"
import { joinCallSession } from "./utils/joinCallSession.js"

interface ClientViewProps {
	sessionId: string
	signalServerUrl: string
	audioElement: HTMLAudioElement
}

export const ClientView = app.light_view((use) => (props: ClientViewProps) => {
	use.name("client-view")
	const { sessionId, audioElement, signalServerUrl } = props

	const [clientId, setClientId] = use.state("")
	const [loading, setLoading] = use.state(false)
	const [errorOccured, setErrorOccured] = use.state(false)
	const [sessionDetails, setSessionDetails] = use.state<
		SessionInfo | undefined
	>(undefined)

	use.mount(() => {
		setLoading(true)
		;(async () => {
			try {
				const { clientId, sessionInfo } = await joinCallSession({
					sessionId,
					audioElement,
					signalServerUrl,
					handleDisconnect,
				})
				setClientId(clientId)
				setSessionDetails(sessionInfo)
				setLoading(false)
			} catch (error) {
				setErrorOccured(true)
				setLoading(false)
				handleDisconnect()
			}
		})()

		return () => {}
	})

	function handleDisconnect() {
		const { localStream, peer } = use.context.client
		peer?.close()
		localStream?.getTracks().forEach((track) => {
			track.stop()
		})
		setSessionDetails(undefined)
	}

	if (loading) {
		return html` ${Spinner([])}`
	}

	return html`
		${!!sessionDetails
			? html`
					<div>Joined a call session</div>
					<p>Client ID: ${clientId}</p>
					<p>Session label: ${sessionDetails?.label}</p>
			  `
			: undefined}
		${errorOccured
			? html`
					<div class="error">
						<p>Error occcured</p>
						<a href=${baseURL}>return to homepage</a>
					</div>
			  `
			: undefined}
	`
})
