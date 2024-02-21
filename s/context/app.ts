import { Nexus, Context, css, watch, ZipAction } from "@benev/slate"

interface CLientState {
	localStream: MediaStream | undefined
	peer: RTCPeerConnection | undefined
}

interface HostState {
	localStream: MediaStream | undefined
	terminateSession: () => void
}

export const app = new Nexus(
	new (class extends Context {
		theme = css`
			*,
			*::after,
			*::before {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
		`

		#counterStore = watch.stateTree<{ count: number }>({
			count: 0,
		})

		get state() {
			return this.#counterStore.state
		}

		actions = ZipAction.actualize(
			this.#counterStore,
			ZipAction.blueprint<{ count: number }>()({
				increment: (state) => () => {
					state.count++
				},
			})
		)

		terminateSession = () => {}
		client = <CLientState>{}
		host = <HostState>{}
	})()
)
