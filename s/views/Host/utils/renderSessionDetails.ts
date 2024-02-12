import { html } from "@benev/slate"
import { PeerConnection, SessionInfo } from "../../../types.js"

export const renderSessionDetails = (
	sessionDetails: SessionInfo | undefined,
	peerConnections: Map<string, PeerConnection>
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
			${displayPeers(peerConnections)}
		`
	}
}

function displayPeers(peerConnections: Map<string, PeerConnection>) {
	const peers = Array.from(peerConnections, ([clientId, peer]) => ({
		clientId,
		peer: peer.peer,
	}))

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
