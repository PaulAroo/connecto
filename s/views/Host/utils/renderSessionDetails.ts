import { html } from "@benev/slate"

import { baseURL } from "../../../config.js"
import { Clipboard } from "../../Clipboard/Clipboard.js"
import { Client, Peer, SessionInfo } from "../../../types.js"

export const renderSessionDetails = (
	sessionDetails: SessionInfo | undefined,
	clients: Client[]
) => {
	if (sessionDetails) {
		const inviteLink = `${baseURL}?session=${sessionDetails.id}`

		return html`
			<div class="session">
				<p><span>session ID: </span>${sessionDetails.id}</p>
				
				<div class="link">
					<p>invite link</p>
					<div class="card">
						<p>${inviteLink}</p>
						${Clipboard([inviteLink])}
					</div>
				</div>
			</div>
			<h4>Clients:</h4>
			<ul>
				${clients.map(
					({ id, connectionState }) =>
						html`
							<li>
								<p>${id} &rarr; <span>${connectionState}</span></p>
							</li>
						`
				)}
			</ul>
		`
	}
}
