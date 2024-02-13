import { queue } from "sparrow-rtc/x/toolbox/queue.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"

import { app } from "../context/app.js"
import { standardRtcConfig } from "./standardRtcConfig.js"

export async function joinCallSession({
	sessionId,
	audioElement,
	signalServerUrl,
	handleDisconnect,
}: {
	sessionId: string
	signalServerUrl: string
	handleDisconnect: () => void
	audioElement: HTMLAudioElement
}) {
	let remoteStream: MediaStream = new MediaStream()
	const peerConnection = new RTCPeerConnection(standardRtcConfig)
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })

	app.context.localStream = localStream
	app.context.peerConnection = peerConnection

	localStream.getAudioTracks().forEach((track) => {
		peerConnection.addTrack(track)
	})

	const connection = await connectToSignalServer({
		url: signalServerUrl,
		client: {
			async handleIceCandidates(candidates) {
				for (const candidate of candidates)
					await peerConnection.addIceCandidate(candidate)
			},
		},
	})

	const joined = await connection.signalServer.connecting.joinSession(sessionId)
	if (!joined) throw new Error("failed to join session")

	const { clientId, sessionInfo } = joined

	const iceQueue = queue(
		async (candidates: any[]) =>
			await connection.signalServer.connecting.submitIceCandidates(
				sessionId,
				clientId,
				candidates
			)
	)

	peerConnection.onicecandidate = async (event) => {
		const candidate = event.candidate
		if (candidate) {
			iceQueue.add(candidate)
		}
	}

	peerConnection.ontrack = (event) => {
		remoteStream.addTrack(event.track)
		audioElement.srcObject = remoteStream
	}

	peerConnection.onconnectionstatechange = () => {
		switch (peerConnection.connectionState) {
			case "new":
			case "connecting":
				console.log("Connecting…")
				break
			case "connected":
				console.log("Online")
				break
			case "disconnected":
				console.log("Disconnected")
				handleDisconnect()
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

	await peerConnection.setRemoteDescription(joined.offer)
	const answer = await peerConnection.createAnswer()
	await peerConnection.setLocalDescription(new RTCSessionDescription(answer))

	await connection.signalServer.connecting.submitAnswer(
		sessionInfo.id,
		clientId,
		answer
	)

	await iceQueue.ready()

	return {
		clientId,
		peerConnection,
		localStream,
		sessionInfo,
	}
}
