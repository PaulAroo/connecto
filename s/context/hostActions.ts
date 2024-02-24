import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"
import { HostActions } from "./types.js"
import { signalServerUrl, standardRtcConfig } from "../config.js"
import { queue } from "sparrow-rtc/x/toolbox/queue.js"
import { app } from "./app.js"
import { handleHostConnectionStateChange } from "../views/Host/utils/handleHostConnectionStateChange.js"
import { watch } from "@benev/slate"

export const prepareHostActions = (): HostActions => {
	let intervalId: number
	let localStream: MediaStream
	let tracks: Map<string, MediaStreamTrack>
	let sessionKey: string
	let terminateSession: (key: string) => Promise<void>

	// TODO: refactor startcall function
	return {
		async startCall(audioElement: HTMLAudioElement) {
			const clients = app.context.clients
			let remoteStream: MediaStream = new MediaStream()
			localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
			const hostTrack = localStream.getAudioTracks()[0]
			tracks = new Map<string, MediaStreamTrack>([["host", hostTrack]])

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
						clients.set(clientId, { peer, iceQueue })

						tracks.forEach((track, key) => {
							if (key !== clientId) peer.addTrack(track)
						})
						peer.ontrack = (event) => {
							remoteStream.addTrack(event.track)
							tracks.set(clientId, event.track)
							audioElement.srcObject = remoteStream

							clients.forEach(({ peer }, key) => {
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
							handleHostConnectionStateChange({
								peer,
								tracks,
								clientId,
								peerConnections: clients,
							})
						)

						const offer = await peer.createOffer()
						peer.setLocalDescription(offer)
						return { offer }
					},
					async handleAnswer(clientId, answer) {
						const { peer, iceQueue } = clients.get(clientId)!
						await peer.setRemoteDescription(new RTCSessionDescription(answer))
						await iceQueue.ready()
					},
					async handleIceCandidates(clientId, candidates) {
						const { peer } = clients.get(clientId)!
						for (const candidate of candidates)
							await peer.addIceCandidate(candidate)
					},
				},
			})
			terminateSession = connection.signalServer.hosting.terminateSession

			const session = await connection.signalServer.hosting.establishSession({
				discoverable: true,
				label: "call test session",
			})
			sessionKey = session.key
			app.context.state.session = session
			watch.dispatch()

			intervalId = window.setInterval(async () => {
				try {
					const start = Date.now()
					const serverTime = await connection.signalServer.hosting.keepAlive()
					const ping = Date.now() - start
					console.log(`ping ${ping}ms, server time ${serverTime}`)
				} catch (error) {
					console.log(2, error)
				}
			}, 10_000)
		},
		async endCall() {
			const clients = app.context.clients
			clients.forEach(({ peer }) => {
				peer.close()
			})
			localStream.getTracks().forEach((track) => {
				track.stop()
			})
			await terminateSession(sessionKey)
			app.context.state.session = undefined
			clearInterval(intervalId)
			clients.clear()
			watch.dispatch()
		},
	}
}
