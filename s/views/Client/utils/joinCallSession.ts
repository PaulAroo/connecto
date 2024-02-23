import { queue } from "sparrow-rtc/x/toolbox/queue.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"

import { app } from "../../../context/app.js"
import { signalServerUrl, standardRtcConfig } from "../../../config.js"
import { handleClientConnectionStateChange } from "./handleClientConnectionStateChange.js"

export async function joinCallSession({
	sessionId,
	audioElement,
	handleDisconnect,
}: {
	sessionId: string
	handleDisconnect: () => void
	audioElement: HTMLAudioElement
}) {
	let remoteStream: MediaStream = new MediaStream()
	const peer = new RTCPeerConnection(standardRtcConfig)
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })

	app.context.client = {
		peer,
		localStream,
	}

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

	peer.onconnectionstatechange = handleClientConnectionStateChange({
		peer,
		handleDisconnect,
	})

	await peer.setRemoteDescription(joined.offer)
	const answer = await peer.createAnswer()
	await peer.setLocalDescription(new RTCSessionDescription(answer))

	await connection.signalServer.connecting.submitAnswer(
		sessionInfo.id,
		clientId,
		answer
	)

	await iceQueue.ready()

	return {
		clientId,
		sessionInfo,
	}
}
