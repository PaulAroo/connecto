import { html } from "@benev/slate"

import { app } from "../../context/app.js"
import { Spinner } from "../spinner/Spinner.js"
import { renderSessionDetails } from "./utils/renderSessionDetails.js"

interface HostViewProps {
	audioElement: HTMLAudioElement
}

export const HostView = app.light_view((use) => (props: HostViewProps) => {
	use.name("host-view")
	const { audioElement } = props
	const [loading, setLoading] = use.state(false)
	const session = use.watch(() => use.context.state.session)

	const clients = use.context.clients
	const { startCall, endCall } = use.context.actions.host
	const startCallSession = async () => {
		try {
			setLoading(true)
			await startCall(audioElement)
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	return html`
		<div>Host a call session</div>
		${loading
			? html`${Spinner([])}`
			: html`
					<button @click=${startCallSession} .disabled=${!!session}>
						start
					</button>
					<button @click=${endCall} .disabled=${!session}>stop</button>
					${renderSessionDetails(session, clients)}
			  `}
	`
})
