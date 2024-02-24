import { html } from "@benev/slate"

import { app } from "../../context/app.js"
import { Spinner } from "../spinner/Spinner.js"
import { Peer, SessionInfo } from "../../types.js"
// import { createCallSession } from "./utils/createCallSession.js"
import { renderSessionDetails } from "./utils/renderSessionDetails.js"

interface HostViewProps {
	audioElement: HTMLAudioElement
}

// rerender when
/*
- session changes
- client's peer conn state change
- 
*/

export const HostView = app.light_view((use) => (props: HostViewProps) => {
	use.name("host-view")
	const { audioElement } = props

	const session = use.watch(() => use.context.state.session)

	const [loading, setLoading] = use.state(false)
	// const [sessionDetails, setSessionDetails] = use.state<
	// SessionInfo | undefined
	// >(undefined)
	// const peerConnections = use.signal(new Map<string, Peer>())

	const clients = use.context.clients
	const { startCall, endCall } = use.context.actions.host
	const startCallSession = async () => {
		try {
			setLoading(true)
			// const session = await createCallSession({
			// 	audioElement,
			// 	peerConnections,
			// })
			await startCall(audioElement)
			// setSessionDetails(session)
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	const stopCallSession = () => {
		// const { localStream, terminateSession } = use.context.host
		// peerConnections.value.forEach(({ peer }) => {
		// 	peer.close()
		// })
		// localStream?.getTracks().forEach((track) => {
		// 	track.stop()
		// })
		// terminateSession()
		// setSessionDetails(undefined)
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
