import Sparrow, { SparrowJoin } from "sparrow-rtc"

import { ClientActions } from "./types.js"
import { watch } from "@benev/slate"
import { app } from "./app.js"

export const prepareClientActions = (): ClientActions => {
	let localStream: MediaStream
	// let closeConnection: () => void
	let peer : RTCPeerConnection | null = null
	let sparrow : SparrowJoin | null = null;

	return {
		async joinCall(invite, audioElement) {

			let remoteStream: MediaStream = new MediaStream()
			localStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			})

			sparrow = await Sparrow.join({
				invite,
				disconnected: () => console.warn(`disconnected from host`),
			})

			peer = sparrow.connection.peer
			const clientId = sparrow.connection.id

			localStream.getAudioTracks().forEach((track) => {
				peer?.addTrack(track)
			})

			app.context.state.session = {id: clientId}
			watch.dispatch()


			peer.ontrack = (event) => {
				remoteStream.addTrack(event.track)
				audioElement.srcObject = remoteStream
			}

			peer.onconnectionstatechange = () => {
				const isDisconnected =
					peer?.connectionState === "failed" ||
					peer?.connectionState === "closed" ||
					peer?.connectionState === "disconnected"

				if (isDisconnected) {
					localStream.getTracks().forEach((track) => {
						track.stop()
					})
					app.context.state.session = undefined
					watch.dispatch()
				}
			}

			return clientId
		},

		disconnect() {
			peer?.close()
			localStream.getTracks().forEach((track) => {
				track.stop()
			})

			sparrow?.close()

			app.context.state.session = undefined
			watch.dispatch()
		},
	}
}
