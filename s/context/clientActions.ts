import { queue } from "sparrow-rtc/x/toolbox/queue.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"

import { ClientActions } from "./types.js"
import { signalServerUrl, standardRtcConfig } from "../config.js"
import { watch } from "@benev/slate"
import { app } from "./app.js"

export const prepareClientActions = (): ClientActions => {
	let localStream: MediaStream
	const peer = new RTCPeerConnection(standardRtcConfig)

	return {
		async joinCall(sessionId, audioElement) {
			let remoteStream: MediaStream = new MediaStream()
			const localStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			})
			localStream.getAudioTracks().forEach((track) => {
				peer.addTrack(track)
			})

			const connection = await connectToSignalServer({
				url: signalServerUrl,
				client: {
					async handleIceCandidates(candidates) {
						for (const candidate of candidates)
							await peer.addIceCandidate(candidate)
					},
				},
			})
			const joined = await connection.signalServer.connecting.joinSession(
				sessionId
			)
			if (!joined) throw new Error("failed to join session")

			const { clientId, sessionInfo } = joined
			app.context.state.session = sessionInfo
			watch.dispatch()

			const iceQueue = queue(
				async (candidates: any[]) =>
					await connection.signalServer.connecting.submitIceCandidates(
						sessionId,
						clientId,
						candidates
					)
			)

			peer.onicecandidate = async (event) => {
				const candidate = event.candidate
				if (candidate) {
					iceQueue.add(candidate)
				}
			}

			peer.ontrack = (event) => {
				remoteStream.addTrack(event.track)
				audioElement.srcObject = remoteStream
			}

			peer.onconnectionstatechange = () => {
				const isDisconnected =
					peer.connectionState === "failed" ||
					peer.connectionState === "closed" ||
					peer.connectionState === "disconnected"

				if (isDisconnected) {
					peer.close()
					localStream.getTracks().forEach((track) => {
						track.stop()
					})
					app.context.state.session = undefined
					watch.dispatch()
				}
			}

			await peer.setRemoteDescription(joined.offer)
			const answer = await peer.createAnswer()
			await peer.setLocalDescription(new RTCSessionDescription(answer))
			await connection.signalServer.connecting.submitAnswer(
				sessionInfo.id,
				clientId,
				answer
			)
			await iceQueue.ready()

			return clientId
		},
		disconnect() {
			peer.close()
			localStream.getTracks().forEach((track) => {
				track.stop()
			})
			app.context.state.session = undefined
			watch.dispatch()
		},
	}
}
