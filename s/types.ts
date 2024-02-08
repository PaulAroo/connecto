import { queue } from "sparrow-rtc/x/toolbox/queue.js"

export type SessionInfo = {
	id: string
	label: string
	discoverable: boolean
}

export type IceQueue = ReturnType<typeof queue>

export type PeerConnection = {
	peer: RTCPeerConnection
	iceQueue: IceQueue
}
