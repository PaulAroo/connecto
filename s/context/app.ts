import { Nexus, Context, css } from "@benev/slate"
import { Actions, State, Streams } from "./types.js"
import { prepareHostActions } from "./hostActions.js"
import { Peer } from "../types.js"

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
			noOfClients: 0,
		}

		clients = new Map<string, Peer>()
		actions: Actions = {
			host: prepareHostActions(),
			client: {},
		}
	})()
)
