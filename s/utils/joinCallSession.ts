import { standardRtcConfig } from "sparrow-rtc/x/connect/utils/standard-rtc-config.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"
import { app } from "../context/app.js"

export async function joinCallSession({
	sessionId,
	audioElement,
	signalServerUrl,
	handleDisconnect,
}: {
	sessionId: string
	signalServerUrl: string
	handleDisconnect: () => void
	audioElement: HTMLAudioElement | null
}) {
	const peerConnection = new RTCPeerConnection(standardRtcConfig)
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })

	app.context.localStream = localStream
	app.context.peerConnection = peerConnection

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

	peerConnection.onicecandidate = async (event) => {
		const candidate = event.candidate
		if (candidate) {
			await connection.signalServer.connecting.submitIceCandidates(
				sessionId,
				clientId,
				[candidate]
			)
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

	return {
		clientId,
		peerConnection,
		localStream,
		sessionInfo,
	}
}
