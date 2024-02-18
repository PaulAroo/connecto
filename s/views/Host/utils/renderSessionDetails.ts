import { html } from "@benev/slate"
import { PeerConnection, SessionInfo } from "../../../types.js"
import { clipboardIcon } from "../../../icons/tabler/ClipboardIcon.js"
import { baseURL } from "../../../config.js"

export const renderSessionDetails = (
	sessionDetails: SessionInfo | undefined,
	peerConnections: Map<string, PeerConnection>
) => {
	if (sessionDetails) {
		return html`
			<div class="session">
				<p><span>session ID: </span>${sessionDetails.id}</p>
				<p><span>session label: </span>${sessionDetails.label}</p>
				<div class="link">
					<p>invite link</p>
					<div class="card">
						<p>${`${baseURL}?session=${sessionDetails.id}`}</p>
						<button>${clipboardIcon}</button>
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
