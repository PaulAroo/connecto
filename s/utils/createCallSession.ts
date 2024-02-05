import { standardRtcConfig } from "sparrow-rtc/x/connect/utils/standard-rtc-config.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"

export async function createCallSession({
	audioElement,
	signalServerUrl,
}: {
	signalServerUrl: string
	audioElement: HTMLAudioElement | null
}) {
	let remoteStream: MediaStream = new MediaStream()
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
	const peerConnection = new RTCPeerConnection(standardRtcConfig)

	localStream.getAudioTracks().forEach((track) => {
		peerConnection.addTrack(track, localStream)
	})

	const connection = await connectToSignalServer({
		url: signalServerUrl,
		host: {
			async handleJoiner(clientId) {
				peerConnection.onicecandidate = async (event) => {
					if (event.candidate) {
						await connection.signalServer.hosting.submitIceCandidates(
							clientId,
							[event.candidate]
						)
					}
				}

				// get remote audio stream from client
				peerConnection.ontrack = (event) => {
					event.streams[0].getTracks().forEach((track) => {
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

				const offer = await peerConnection.createOffer()
				peerConnection.setLocalDescription(offer)
				return { offer }
			},
			async handleAnswer(clientId, answer) {
				await peerConnection.setRemoteDescription(
					new RTCSessionDescription(answer)
				)
			},
			async handleIceCandidates(clientId, candidates) {
				for (const candidate of candidates)
					await peerConnection.addIceCandidate(candidate)
			},
		},
	})

	const session = await connection.signalServer.hosting.establishSession({
		discoverable: true,
		label: "call test session",
	})

	return {
		session,
		peerConnection,
		localStream,
	}
}
