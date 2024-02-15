import { css } from "@benev/slate"

export default css`
	:host {
		display: block;
	}

	.status {
		padding: 1rem 0.5rem;
	}

	.spin {
		display: inline;
		width: 2rem;
		height: 2rem;
		color: #ffffff;
		fill: #6a6a6a;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
`
