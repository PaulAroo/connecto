import { html } from "@benev/slate"
import { app } from "../../context/app.js"

import styles from "./style.css.js"

export const HostView = app.shadow_view((use) => () => {
	use.name("host-view")
	use.styles(styles)

	return html` <p>host view</p> `
})
