import { Nexus, Context, css } from "@benev/slate"
import { urlHasSessionId } from "../utils/urlHasSessionId.js"

export const app = new Nexus(
	new (class extends Context {
		theme = css`
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
		`

		isHost = urlHasSessionId()
	})()
)
