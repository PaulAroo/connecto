import { css } from "@benev/slate"

export default css`
	.container {
		width: fit-content;
		margin-top: 1rem;
	}

	button {
		background: transparent;
		border: 1px solid darkslategrey;
		color: inherit;
		text-transform: capitalize;
		padding: 0.5em 1em;
		cursor: pointer;
		border-radius: 5px;
		margin-top: 0.5em;
	}

	button:disabled {
		opacity: 0.2;
		cursor: not-allowed;
	}

	a {
		color: burlywood;
	}
`
