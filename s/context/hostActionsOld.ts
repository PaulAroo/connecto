// import { watch } from "@benev/slate"
// import { queue } from "sparrow-rtc/x/toolbox/queue.js"
// import { connectToSignalServer } from "sparrow-rtc/x/connect/utils/connect-to-signal-server.js"

// import { app } from "./app.js"
// import { Peer } from "../types.js"
// import { HostActions } from "./types.js"
// import { signalServerUrl, standardRtcConfig } from "../config.js"
// import { handleHostConnectionStateChange } from "../views/Host/utils/handleHostConnectionStateChange.js"

// export const prepareHostActions = (): HostActions => {
// 	let intervalId: number
// 	// let localStream: MediaStream
// 	let tracks: Map<string, MediaStreamTrack>
// 	let sessionKey: string
// 	let terminateSession: (key: string) => Promise<void>
// 	const peerConnections = new Map<string, Peer>()

// 	// TODO: refactor startcall function
// 	return {
// 		async startCall(audioElement, localStream) {
// 			let remoteStream: MediaStream = new MediaStream()
// 			// localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
// 			const hostTrack = localStream.getAudioTracks()[0]
// 			tracks = new Map<string, MediaStreamTrack>([["host", hostTrack]])

// 			const connection = await connectToSignalServer({
// 				url: signalServerUrl,
// 				host: {
// 					async handleJoiner(clientId) {
// 						const peer = new RTCPeerConnection(standardRtcConfig)
// 						const iceQueue = queue(async (candidates: any[]) =>
// 							connection.signalServer.hosting.submitIceCandidates(
// 								clientId,
// 								candidates
// 							)
// 						)
// 						peerConnections.set(clientId, { peer, iceQueue })
// 						app.context.actions.host.addClient(clientId)

// 						tracks.forEach((track, key) => {
// 							if (key !== clientId) peer.addTrack(track)
// 						})

// 						peer.ontrack = (event) => {
// 							remoteStream.addTrack(event.track)
// 							tracks.set(clientId, event.track)
// 							audioElement.srcObject = remoteStream

// 							peerConnections.forEach(({ peer }, key) => {
// 								if (key !== clientId) peer.addTrack(event.track)
// 							})
// 						}

// 						peer.onicecandidate = async (event) => {
// 							if (event.candidate) {
// 								iceQueue.add(event.candidate)
// 							}
// 						}

// 						peer.onconnectionstatechange = handleHostConnectionStateChange(
// 							clientId,
// 							peer
// 						)

// 						const offer = await peer.createOffer()
// 						peer.setLocalDescription(offer)
// 						return { offer }
// 					},

// 					async handleAnswer(clientId, answer) {
// 						const { peer, iceQueue } = peerConnections.get(clientId)!
// 						await peer.setRemoteDescription(new RTCSessionDescription(answer))
// 						await iceQueue.ready()
// 					},

// 					async handleIceCandidates(clientId, candidates) {
// 						const { peer } = peerConnections.get(clientId)!
// 						for (const candidate of candidates)
// 							await peer.addIceCandidate(candidate)
// 					},
// 				},
// 			})


// 			terminateSession = connection.signalServer.hosting.terminateSession

// 			const session = await connection.signalServer.hosting.establishSession({
// 				discoverable: true,
// 				label: "call test session",
// 			})
// 			sessionKey = session.key
// 			app.context.state.session = session
// 			watch.dispatch()

// 			intervalId = window.setInterval(async () => {
// 				try {
// 					const start = Date.now()
// 					const serverTime = await connection.signalServer.hosting.keepAlive()
// 					const ping = Date.now() - start
// 					console.log(`ping ${ping}ms, server time ${serverTime}`)
// 				} catch (error) {
// 					console.log(2, error)
// 				}
// 			}, 10_000)
// 		},

// 		async endCall(localStream) {
// 			app.context.state.session = undefined
// 			app.context.state.clients = []
// 			watch.dispatch()
// 			peerConnections.forEach(({ peer }) => {
// 				peer.close()
// 			})
// 			localStream.getTracks().forEach((track) => {
// 				track.stop()
// 			})
// 			await terminateSession(sessionKey)
// 			clearInterval(intervalId)
// 			peerConnections.clear()
// 		},
// 		updateClientConnectionState(client) {
// 			const clients = app.context.state.clients
// 			app.context.state.clients = clients.map((c) =>
// 				c.id === client.id
// 					? { ...c, connectionState: client.connectionState }
// 					: c
// 			)
// 			watch.dispatch()
// 		},
// 		addClient(clientId) {
// 			const clients = app.context.state.clients
// 			app.context.state.clients = [
// 				...clients,
// 				{ id: clientId, connectionState: "new" },
// 			]
// 		},
// 		removeClient(id) {
// 			const clients = app.context.state.clients
// 			app.context.state.clients = clients.filter((c) => c.id !== id)
// 			peerConnections.delete(id)
// 			tracks.delete(id)
// 			watch.dispatch()
// 		},
// 	}
// }
