
import Sparrow, { SparrowHost } from "sparrow-rtc"
import { app } from "./app.js"
import { watch } from "@benev/slate"

import { HostActions } from "./types.js"
import { handleHostConnectionStateChange } from "../views/Host/utils/handleHostConnectionStateChange.js"
import { Peer } from "../types.js"

export const prepareHostActions = (): HostActions => {

	const peerConnections = new Map<string, Peer>()
	let sparrow : SparrowHost | null = null;

	return {
		async startCall(audioElement, localStream) {
			const peerConnections = new Map<string, RTCPeerConnection>()
			let remoteStream: MediaStream = new MediaStream()
			// const hostTrack = localStream.getAudioTracks()[0]

			sparrow = await Sparrow.host({
				welcome: _ => connection => {
					const clientId = connection.id
					const peer = connection.peer

					peerConnections.set(clientId, peer)

					// client state
					app.context.actions.host.addClient(clientId)

					peer.ontrack = (event) => {
						remoteStream.addTrack(event.track)
						audioElement.srcObject = remoteStream
					}

					peer.onconnectionstatechange = handleHostConnectionStateChange(
												clientId,
												peer.connectionState
											)
		

					// react to the other side disconnecting
					return () => {
						app.context.actions.host.removeClient(clientId)
					}
				},
				closed: () => {
					console.warn("connection to signaller lost")
				}
			})

			app.context.state.session = {id: sparrow?.invite}
			watch.dispatch()
		},


		async endCall(localStream) {
			app.context.state.session = undefined
			app.context.state.clients = []
			watch.dispatch()

			peerConnections.forEach(({ peer }) => {
				peer.close()
			})
			localStream.getTracks().forEach((track) => {
				track.stop()
			})

			peerConnections.clear()
			sparrow?.close()
		},

		updateClientConnectionState(client) {
			const clients = app.context.state.clients
			app.context.state.clients = clients.map((c) =>
				c.id === client.id
					? { ...c, connectionState: client.connectionState }
					: c
			)
			watch.dispatch()
		},
		addClient(clientId) {
			const clients = app.context.state.clients
			app.context.state.clients = [
				...clients,
				{ id: clientId, connectionState: "new" },
			]
		},
		removeClient(id) {
			const clients = app.context.state.clients
			app.context.state.clients = clients.filter((c) => c.id !== id)
			peerConnections.delete(id)
			// tracks.delete(id)
			watch.dispatch()
		},
	}
}

