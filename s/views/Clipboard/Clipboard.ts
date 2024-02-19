import { html } from "@benev/slate"
import { app } from "../../context/app.js"
import { clipboardIcon } from "../../icons/tabler/ClipboardIcon.js"

import styles from "./style.css.js"

export const Clipboard = app.shadow_view((use) => (text: string) => {
	use.name("clipboard")
	use.styles(styles)

	const copyToClipboard = () => {
		navigator.clipboard.writeText(text)
	}

	return html` <button @click=${copyToClipboard}>${clipboardIcon}</button> `
})
