import { Signal } from "@benev/slate"
import { queue } from "sparrow-rtc/x/toolbox/queue.js"
import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"

import { app } from "../../../context/app.js"
import { PeerConnection, SessionInfo } from "../../../types.js"
import { standardRtcConfig } from "../../../utils/standardRtcConfig.js"
import { handlePeerConnectionStateChange } from "./handlePeerConnectionStateChange.js"

export async function createCallSession({
	audioElement,
	signalServerUrl,
	peerConnections,
}: {
	signalServerUrl: string
	audioElement: HTMLAudioElement
	peerConnections: Signal<Map<string, PeerConnection>>
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
				const iceQueue = queue(async (candidates: any[]) =>
					connection.signalServer.hosting.submitIceCandidates(
						clientId,
						candidates
					)
				)
				peerConnections.value.set(clientId, { peer, iceQueue })

				tracks.forEach((track, key) => {
					if (key !== clientId) peer.addTrack(track)
				})
				peer.ontrack = (event) => {
					remoteStream.addTrack(event.track)
					tracks.set(clientId, event.track)
					audioElement.srcObject = remoteStream

					peerConnections.value.forEach(({ peer }, key) => {
						if (key !== clientId) peer.addTrack(event.track)
					})
				}

				peer.onicecandidate = async (event) => {
					if (event.candidate) {
						iceQueue.add(event.candidate)
					}
				}

				peer.addEventListener(
					"connectionstatechange",
					handlePeerConnectionStateChange({
						peer,
						tracks,
						clientId,
						peerConnections,
					})
				)

				const offer = await peer.createOffer()
				peer.setLocalDescription(offer)
				return { offer }
			},
			async handleAnswer(clientId, answer) {
				const { peer, iceQueue } = peerConnections.value.get(clientId)!
				await peer.setRemoteDescription(new RTCSessionDescription(answer))
				await iceQueue.ready()
			},
			async handleIceCandidates(clientId, candidates) {
				const { peer } = peerConnections.value.get(clientId)!
				for (const candidate of candidates)
					await peer.addIceCandidate(candidate)
			},
		},
	})

	const session = await connection.signalServer.hosting.establishSession({
		discoverable: true,
		label: "call test session",
	})

	const intervalId = setInterval(async () => {
		try {
			const start = Date.now()
			const serverTime = await connection.signalServer.hosting.keepAlive()
			const ping = Date.now() - start
			console.log(`ping ${ping}ms, server time ${serverTime}`)
		} catch (error) {
			console.log(2, error)
		}
	}, 10_000)

	app.context.localStream = localStream
	app.context.terminateSession = () => {
		connection.signalServer.hosting.terminateSession(session.key)
		clearInterval(intervalId)
	}

	return session as SessionInfo
}
