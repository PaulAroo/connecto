import { css } from "@benev/slate"

export default css`
	:host {
		display: block;
	}

	button {
		display: flex;
		border: none;
		margin-top: 0;
		padding: 0;
		font-size: 1.2rem;
		color: lightskyblue;
		background: none;
		cursor: pointer;
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.8);
		}
	}
`
