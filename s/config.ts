const isDevMode =
	window.location.host.startsWith("localhost") ||
	window.location.host.startsWith("192.")

export const baseURL = isDevMode
	? "http://localhost:8080/"
	: "https://paularoo.github.io/connecto/"

export const standardRtcConfig: RTCConfiguration = {
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
		{
			urls: "turns:freeturn.tel:5349",
			username: "free",
			credential: "free",
		},
	],
}

export const signalServerUrl = "wss://sparrow-rtc.benevolent.games/"
