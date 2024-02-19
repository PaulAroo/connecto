import { css } from "@benev/slate"

export default css`
	:host {
		display: block;
		position: relative;
		width: fit-content;
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

	span {
		position: absolute;
		opacity: 0;
		top: -1rem;
		animation: fade_in_out 1s ease forwards;
	}

	@keyframes fade_in_out {
		50% {
			opacity: 100%;
		}
		100% {
			display: none;
			opacity: 0;
			transform: translateY(-1rem);
		}
	}
`

// animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, animation-play-state, and animation-timeline.

// fade_in_out 1s ease 0.2s forwards
