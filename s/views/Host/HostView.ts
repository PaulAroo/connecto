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
	const [error, setError] = use.state(false)
	const [localStream, setLocalStream, getLocalStream] = use.state<MediaStream | null>(null)

	const clients = use.watch(() => use.context.state.clients)
	const session = use.watch(() => use.context.state.session)

	const { startCall, endCall } = use.context.actions.host
	const startCallSession = async () => {
		try {
			const localStr = await navigator.mediaDevices.getUserMedia({ audio: true })
			setLocalStream(localStr)
			setError(false)
			setLoading(true)

			await startCall(audioElement, localStr)

			setLoading(false)
		} catch (error) {
			setError(true)
			// console.log(getLocalStream())
			getLocalStream()?.getTracks().forEach((track) => {
				// console.log("stopping tracks")
				track.stop()
			})
			console.log(error)
			setLoading(false)
		}
	}

	const endCallSession = async () => {
		try {
			endCall(localStream!)
		} catch (error) {
			setError(true)
		}
	}

	return html`
		<div>Host a call session</div>
		${loading
			? html`${Spinner([])}`
			: html`
					<div>
						<div>
							<button @click=${startCallSession} .disabled=${!!session}>
								start
							</button>
							<button @click=${endCallSession} .disabled=${!session}>end</button>
						</div>
						${error ? html`<span class="error">(web socket) connection failed</span>` : null}
					</div>
					${renderSessionDetails(session, clients)}
			  `}
	`
})
