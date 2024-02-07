import { Signal } from "@benev/slate"
import { standardRtcConfig } from "sparrow-rtc/x/connect/utils/standard-rtc-config.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"

import { app } from "../context/app.js"
import { SessionInfo } from "../types.js"

export async function createCallSession({
	audioElement,
	signalServerUrl,
	setConnectedPeers,
}: {
	signalServerUrl: string
	setConnectedPeers: (v: number) => void
	audioElement: HTMLAudioElement | null
}) {
	let remoteStream: MediaStream = new MediaStream()
	const peerDetails = new Map<string, RTCPeerConnection>()
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
	const hostTrack = localStream.getAudioTracks()[0]
	const tracks = new Map<string, MediaStreamTrack>([["host", hostTrack]])

	const connection = await connectToSignalServer({
		url: signalServerUrl,
		host: {
			async handleJoiner(clientId) {
				const peer = new RTCPeerConnection(standardRtcConfig)
				peerDetails.set(clientId, peer)
				setConnectedPeers(peerDetails.size)

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

				// get remote audio stream from client
				peer.ontrack = (event) => {
					event.streams[0].getTracks().forEach((track) => {
						remoteStream.addTrack(track)
						tracks.set(clientId, track)
					})

					if (audioElement) audioElement.srcObject = remoteStream
				}

				// manage connection state
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
							peerDetails.delete(clientId)
							setConnectedPeers(peerDetails.size)
							tracks.delete(clientId)
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
				const peer = peerDetails.get(clientId)!
				await peer.setRemoteDescription(new RTCSessionDescription(answer))
			},
			async handleIceCandidates(clientId, candidates) {
				const peer = peerDetails.get(clientId)!
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
