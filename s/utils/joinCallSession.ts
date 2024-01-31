import { standardRtcConfig } from "sparrow-rtc/x/connect/utils/standard-rtc-config.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"
import { queue } from "sparrow-rtc/x/toolbox/queue.js"

export async function joinCallSession({
	signalServerUrl,
	sessionId,
	audioElement,
}: {
	signalServerUrl: string
	sessionId: string
	audioElement: HTMLAudioElement | null
}) {
	const peerConnection = new RTCPeerConnection(standardRtcConfig)
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })

	localStream.getTracks().forEach((track) => {
		peerConnection.addTrack(track, localStream)
	})

	let remoteStream: MediaStream = new MediaStream()

	const connection = await connectToSignalServer({
		url: signalServerUrl,
		client: {
			async handleIceCandidates(candidates) {
				for (const candidate of candidates)
					await peerConnection.addIceCandidate(candidate)
			},
		},
	})

	const iceQueue = queue(
		async (candidates: any[]) =>
			await connection.signalServer.connecting.submitIceCandidates(
				sessionId,
				clientId,
				candidates
			)
	)

	peerConnection.onicecandidate = (event) => {
		const candidate = event.candidate
		if (candidate) {
			iceQueue.add(candidate)
		}
	}

	// get remote audio stream from client
	peerConnection.ontrack = (event) => {
		event.streams[0].getAudioTracks().forEach((track) => {
			remoteStream.addTrack(track)
		})

		if (audioElement) audioElement.srcObject = remoteStream
	}

	// manage connection state
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
				console.log("Disconnecting…")
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

	const joined = await connection.signalServer.connecting.joinSession(sessionId)
	if (!joined) throw new Error("failed to join session")

	const { clientId, sessionInfo } = joined

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
