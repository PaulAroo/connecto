import { Nexus, Context, css } from "@benev/slate"

export const app = new Nexus(
	new (class extends Context {
		theme = css`
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
		`
	})()
)
