import { css } from "@benev/slate"

export default css`
	.container {
		width: fit-content;
		margin-top: 1rem;
    /* border: 1px solid red; */
	}

	.error {
		color: red;
		opacity: 0.7;
		letter-spacing: 1px;
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

	span {
		color: gray;
	}

	h4 {
		margin-top: 1em;
	}

	ul {
		margin-left: 1em;
	}

	.session {
		margin-top: 1em;
	}

	.link {
		margin-top: 0.5em;

		.card {
			display: flex;
			gap: 1rem;
			align-items: center;
			margin-bottom: 1em;
			padding: 0.2em 0.5em;
			border-radius: 8px;
			box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
				rgba(0, 0, 0, 0.23) 0px 3px 6px;

			p {
				color: lightgray;
			}
		}

		p {
			color: gray;
		}
	}
`
