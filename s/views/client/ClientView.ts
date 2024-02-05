import { html } from "@benev/slate"
import { app } from "../../context/app.js"

import styles from "./style.css.js"

export const ClientView = app.shadow_view((use) => () => {
	use.name("client-view")
	use.styles(styles)

	return html` <p>client view</p> `
})
