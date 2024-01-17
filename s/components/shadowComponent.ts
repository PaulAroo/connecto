import { html } from "@benev/slate"
import { app } from "../context/app.js"

export const MyShadowComponent = app.shadow_component((_) => {
	return html` <div>first shadow component</div> `
})
