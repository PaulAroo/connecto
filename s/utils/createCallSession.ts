import { standardRtcConfig } from "sparrow-rtc/x/connect/utils/standard-rtc-config.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"

import { queue } from "sparrow-rtc/x/toolbox/queue.js"

export async function createCallSession({
	signalServerUrl,
}: {
	signalServerUrl: string
}) {
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
	const peerConnection = new RTCPeerConnection(standardRtcConfig)

	localStream.getAudioTracks().forEach((track) => {
		peerConnection.addTrack(track, localStream)
	})

	let remoteStream: MediaStream

	const connection = await connectToSignalServer({
		url: signalServerUrl,
		host: {
			async handleJoiner(clientId) {
				// gather and send ice candidate
				const iceQueue = queue(async (candidates: any[]) =>
					connection.signalServer.hosting.submitIceCandidates(
						clientId,
						candidates
					)
				)
				peerConnection.onicecandidate = (event) => {
					if (event.candidate) iceQueue.add(event.candidate)
				}

				// get remote audio stream from client
				peerConnection.ontrack = (event) => {
					event.streams[0].getAudioTracks().forEach((track) => {
						remoteStream.addTrack(track)
					})
				}

				const offer = await peerConnection.createOffer()
				peerConnection.setLocalDescription(offer)
				return { offer }
			},
			async handleAnswer(clientId, answer) {},
			async handleIceCandidates(clientId, candidates) {},
		},
	})
}