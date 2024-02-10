import { html } from "@benev/slate"

import styles from "./styles.css.js"
import { app } from "../../context/app.js"
import { HostView } from "../../views/Host/HostView.js"
import { ClientView } from "../../views/ClientView.js"
import { getSessionIdFromUrl } from "../../utils/getSessionIdFromUrl.js"

const signalServerUrl = "wss://sparrow-rtc.benevolent.games/"

export const ConnectTo = app.shadow_component((use) => {
	use.styles(styles)

	const sessionId = getSessionIdFromUrl()
	const isHost = !sessionId

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
				: ClientView({ audioElement, signalServerUrl, sessionId })}
		</div>
	`
})

// TODO
// button to copy session link to clipboard
// feat: client can disconnect from a call
// create handlers and behaviours for different
//   peer connection states
// display call duration/state
