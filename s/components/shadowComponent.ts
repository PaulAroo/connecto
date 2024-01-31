import { html } from "@benev/slate"
import { app } from "../context/app.js"

export const CalleeSlate = app.shadow_component((use) => {
	const isHost = use.context.isHost

	const startCallSession = () => {
		const audioElement = use.shadow.querySelector("audio")
		console.log(2, audioElement)
	}

	const stopCallSession = () => {}

	const renderAsHost = () => {
		return html`
			<div>intialized as a host</div>
			<button @click=${startCallSession}>start a call session</button>
			<button @click=${stopCallSession} disabled>stop</button>
		`
	}

	const renderAsClient = () => {
		return html` <div>intialized as a client</div> `
	}

	return html` <audio autoplay></audio>
		<div>first shadow component</div>
		${isHost ? renderAsHost() : renderAsClient()}`
})
