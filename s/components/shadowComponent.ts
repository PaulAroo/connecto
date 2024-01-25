import { html } from "@benev/slate"
import { app } from "../context/app.js"

export const CalleeSlate = app.shadow_component((use) => {
	use.mount(() => {
		console.log(window.location)
		return () => {}
	})

	return html` <div>first shadow component</div> `
})
