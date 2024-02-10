import { html } from "@benev/slate"
import { SessionInfo } from "../../../types.js"

export const renderSessionDetails = (
	sessionDetails: SessionInfo | undefined
) => {
	if (sessionDetails) {
		return html`
			<div class="session">
				<p><span>session ID: </span>${sessionDetails.id}</p>
				<p><span>session label: </span>${sessionDetails.label}</p>
				<p>
					<span>link to join session: </span>
					<a href=${`${location.href}?session=${sessionDetails.id}`}
						>${`${location.href}?session=${sessionDetails.id}`}</a
					>
				</p>
			</div>
		`
	}
}
