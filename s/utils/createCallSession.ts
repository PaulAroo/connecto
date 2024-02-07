import { Signal } from "@benev/slate"
import { standardRtcConfig } from "sparrow-rtc/x/connect/utils/standard-rtc-config.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"

import { app } from "../context/app.js"
import { SessionInfo } from "../types.js"

export async function createCallSession({
	audioElement,
	signalServerUrl,
	peerConnections,
}: {
	signalServerUrl: string
	audioElement: HTMLAudioElement | null
	peerConnections: Signal<Map<string, RTCPeerConnection>>
}) {
	let remoteStream: MediaStream = new MediaStream()
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
	const hostTrack = localStream.getAudioTracks()[0]
	const tracks = new Map<string, MediaStreamTrack>([["host", hostTrack]])

	const connection = await connectToSignalServer({
		url: signalServerUrl,
		host: {
			async handleJoiner(clientId) {
				const peer = new RTCPeerConnection(standardRtcConfig)
				peerConnections.value.set(clientId, peer)
				peerConnections.publish()

				tracks.forEach((track, key) => {
					if (key !== clientId) peer.addTrack(track)
				})

				peer.onicecandidate = async (event) => {
					if (event.candidate) {
						await connection.signalServer.hosting.submitIceCandidates(
							clientId,
							[event.candidate]
						)
					}
				}

				peer.ontrack = (event) => {
					event.streams[0].getTracks().forEach((track) => {
						remoteStream.addTrack(track)
						tracks.set(clientId, track)
					})

					if (audioElement) audioElement.srcObject = remoteStream
				}

				peer.onconnectionstatechange = () => {
					switch (peer.connectionState) {
						case "new":
						case "connecting":
							console.log("Connecting…")
							break
						case "connected":
							console.log("Online")
							break
						case "disconnected":
							console.log("disconnected")
							peerConnections.value.delete(clientId)
							tracks.delete(clientId)
							peerConnections.publish()
							break
						case "closed":
							console.log("Offline")
							break
						case "failed":
							console.log("Error")
							break
						default:
							console.log("Unknown")
							break
					}
				}

				const offer = await peer.createOffer()
				peer.setLocalDescription(offer)
				return { offer }
			},
			async handleAnswer(clientId, answer) {
				const peer = peerConnections.value.get(clientId)!
				await peer.setRemoteDescription(new RTCSessionDescription(answer))
			},
			async handleIceCandidates(clientId, candidates) {
				const peer = peerConnections.value.get(clientId)!
				for (const candidate of candidates)
					await peer.addIceCandidate(candidate)
			},
		},
	})

	const session = await connection.signalServer.hosting.establishSession({
		discoverable: true,
		label: "call test session",
	})

	app.context.localStream = localStream
	app.context.terminateSession = () => {
		connection.signalServer.hosting.terminateSession(session.key)
	}

	return session as SessionInfo
}
