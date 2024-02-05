import { html } from "@benev/slate"

import styles from "./styles.css.js"
import { app } from "../../context/app.js"
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

	return html`
		<div class="container">
			${audioElement}
			${isHost
				? HostView({ audioElement, signalServerUrl })
				: ClientView({ audioElement, signalServerUrl })}
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
