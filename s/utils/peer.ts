// when I click the button to make a call, I am a host
// create a peerConnection object
// create offer, set it as local description and send it
// listen for an answer, (set the answer as remote description)

// when there is a session id (inputed or parsed from a link), I am a client
// what happens when a client clicks the link or provides a session ID
// how do we know that they(a client) have joined??, so that we can send then the SDP offer
// and in turn, they send an answer

const standardRtcConfig: RTCConfiguration = {
	iceServers: [
		{
			urls: [
				"stun:stun.l.google.com:19302",
				"stun:stun1.l.google.com:19302",
				"stun:stun2.l.google.com:19302",
				"stun:stun3.l.google.com:19302",
				"stun:stun4.l.google.com:19302",
			],
		},
	],
}

async function joinACallSession() {
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
	const peerConnection = new RTCPeerConnection(standardRtcConfig)

	localStream.getAudioTracks().forEach((track) => {
		peerConnection.addTrack(track)
	})

	const answer = await peerConnection.createAnswer()
	peerConnection.setLocalDescription(answer)
}
