import { html } from "@benev/slate"

import { baseURL } from "../../config.js"
import { app } from "../../context/app.js"
import { Spinner } from "../spinner/Spinner.js"

interface ClientViewProps {
	sessionId: string
	audioElement: HTMLAudioElement
}

export const ClientView = app.light_view((use) => (props: ClientViewProps) => {
	use.name("client-view")
	const { sessionId, audioElement } = props

	const [clientId, setClientId] = use.state("")
	const [loading, setLoading] = use.state(false)
	const [errorOccured, setErrorOccured] = use.state(false)
	const sessionDetails = use.watch(() => use.context.state.session)

	const { joinCall, disconnect } = use.context.actions.client

	use.mount(() => {
		setLoading(true)
		;(async () => {
			try {
				const clientId = await joinCall(sessionId, audioElement)
				setClientId(clientId)
				setLoading(false)
			} catch (error) {
				console.log(error)
				setErrorOccured(true)
				setLoading(false)
				disconnect()
			}
		})()

		return () => {}
	})

	if (loading) {
		return html` ${Spinner([])}`
	}

	return html`
		${!!sessionDetails
			? html`
					<div>Joined a call session</div>
					<p>Client ID: ${clientId}</p>
					<p>Session label: ${sessionDetails?.id}</p>
					<button @click=${disconnect}>end call</button>
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
