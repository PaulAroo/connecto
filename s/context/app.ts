import { Nexus, Context, css } from "@benev/slate"

import { Actions, State } from "./types.js"
import { prepareHostActions } from "./hostActions.js"
// import { prepareClientActions } from "./clientActions.js"

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
		state: State = {
			session: undefined,
			clients: [],
		}
		actions: Actions = {
			host: prepareHostActions(),
			client: () => {},
		}
	})()
)
