import { html } from "@benev/slate"

import styles from "./styles.css.js"
import { app } from "../../context/app.js"
import { joinCallSession } from "../../utils/joinCallSession.js"
import { createCallSession } from "../../utils/createCallSession.js"
import { HostView } from "../../views/HostView.js"
import { ClientView } from "../../views/ClientView.js"

const signalServerUrl = "wss://sparrow-rtc.benevolent.games/"

export const ConnectTo = app.shadow_component((use) => {
	use.styles(styles)

	const isHost = !use.context.sessionId

	const audioElement = use.once(() => {
		const audio = document.createElement("audio")
		audio.autoplay = true
		return audio
	})

	// const [clientId, setClientId] = use.state("")
	// const [sessionDetails, setSessionDetails] = use.state<
	// 	SessionInfo | undefined
	// >(undefined)

	// use.mount(() => {
	// 	const sessionId = use.context.sessionId
	// 	if (sessionId) {
	// 		;(async () => {
	// 			const { clientId, sessionInfo } = await joinCallSession({
	// 				sessionId,
	// 				audioElement,
	// 				signalServerUrl,
	// 			})

	// 			setClientId(clientId)
	// 			setSessionDetails(sessionInfo)
	// 			use.context.session = sessionInfo
	// 		})()
	// 	}

	// 	return () => {}
	// })

	// 	setSessionDetails(undefined)
	// 	use.context.session = undefined
	// 	use.context.localStream = undefined
	// 	use.context.peerConnection = undefined
	// }

	// const renderAsClient = () => {
	// 	return html`
	// 		<div>Joined a call session</div>
	// 		<p>Client ID: ${clientId}</p>
	// 		<p>Session label: ${use.context.session?.label}</p>
	// 	`
	// }

	return html`
		<div class="container">
			${audioElement}
			${isHost ? HostView({ audioElement, signalServerUrl }) : ClientView()}
		</div>
	`
})

// TODO
// button to copy session link to clipboard
// refactor entire component
// feat: client can disconnect from a call
// create separate views for host and client
// create handlers and behaviours for different
//   peer connection states
// display call duration/state

// what happens on the client side when a host ends a session?
//     peer connection state becomes disconnected, then goes into error state
//  how should that be handled
