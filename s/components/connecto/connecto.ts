import { html } from "@benev/slate"

import styles from "./styles.css.js"
import { app } from "../../context/app.js"
import { HostView } from "../../views/Host/HostView.js"
import { ClientView } from "../../views/Client/ClientView.js"
import { getSessionIdFromUrl } from "../../utils/getSessionIdFromUrl.js"

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
				? HostView({ audioElement })
				: ClientView({ audioElement, sessionId })}
		</div>
	`
})
