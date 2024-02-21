import { Nexus, Context, css, watch } from "@benev/slate"

import { State } from "./types.js"
import { hostState } from "./hostManager.js"
import { clientState } from "./clientManager.js"

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
				remote: undefined,
			},
			client: clientState,
			host: hostState,
		})

		get state() {
			return this.#state.state
		}
	})()
)
