import { html } from "@benev/slate"

import { baseURL } from "../../../config.js"
import { Clipboard } from "../../Clipboard/Clipboard.js"
import { PeerConnection, SessionInfo } from "../../../types.js"

export const renderSessionDetails = (
	sessionDetails: SessionInfo | undefined,
	peerConnections: Map<string, PeerConnection>
) => {
	if (sessionDetails) {
		const inviteLink = `${baseURL}?session=${sessionDetails.id}`
		const copyToClipboard = () => {
			navigator.clipboard.writeText(inviteLink)
		}

		return html`
			<div class="session">
				<p><span>session ID: </span>${sessionDetails.id}</p>
				<p><span>session label: </span>${sessionDetails.label}</p>
				<div class="link">
					<p>invite link</p>
					<div class="card">
						<p>${inviteLink}</p>
						${Clipboard([inviteLink])}
					</div>
				</div>
			</div>
			${displayPeers(peerConnections)}
		`
	}
}

function displayPeers(peerConnections: Map<string, PeerConnection>) {
	const peers = Array.from(peerConnections, ([clientId, peer]) => ({
		clientId,
		peer: peer.peer,
	}))

	const hasNoClients = !peers.length
	if (hasNoClients) {
		return html` <span>no joiners yet</span> `
	}

	return html`
		<h4>Connected clients:</h4>
		<ul>
			${peers.map(
				({ clientId, peer }) =>
					html`
						<li>
							<p>${clientId} &rarr; <span>${peer.connectionState}</span></p>
						</li>
					`
			)}
		</ul>
	`
}
