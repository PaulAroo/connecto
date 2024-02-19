import { html } from "@benev/slate"

import styles from "./style.css.js"
import { app } from "../../context/app.js"
import { clipboardIcon } from "../../icons/tabler/ClipboardIcon.js"

export const Clipboard = app.shadow_view((use) => (text: string) => {
	use.name("clipboard")
	use.styles(styles)
	const [showToolTip, setShowToolTip] = use.state(false)

	const copyToClipboard = () => {
		navigator.clipboard.writeText(text)
		setShowToolTip(true)
		setTimeout(() => {
			setShowToolTip(false)
		}, 1000)
	}

	return html`
		<button @click=${copyToClipboard}>${clipboardIcon}</button>
		${showToolTip ? html`<span>copied!</span>` : undefined}
	`
})
