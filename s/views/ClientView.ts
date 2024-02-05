import { html } from "@benev/slate"
import { app } from "../context/app.js"

export const ClientView = app.light_view((use) => () => {
	use.name("client-view")

	return html` <p>client view</p> `
})
