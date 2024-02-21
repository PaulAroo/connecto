import { Nexus, Context, css, watch, ZipAction } from "@benev/slate"

import { State } from "./types.js"
import { hostActions, hostState } from "./hostManager.js"
import { clientActions, clientState } from "./clientManager.js"

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

		#state = watch.stateTree<State>({
			streams: {
				local: undefined,
				remote: new MediaStream(),
			},
			client: clientState,
			host: hostState,
		})

		actions = ZipAction.actualize(this.#state, {
			host: hostActions,
			client: clientActions,
		})

		get state() {
			return this.#state.state
		}
	})()
)
