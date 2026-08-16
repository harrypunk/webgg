<!-- Decorative space backdrop: dark sky, sparse stars, meteors flying from
	 top-left to bottom-right. Fixed behind all content via its own negative
	 z-index — no text, button, or canvas needs stacking rules of its own.
	 All styles are scoped to this component. -->
<div class="meteor-sky" aria-hidden="true">
	{#each Array.from({ length: 8 }, (_, i) => i) as i (i)}
		<div class="meteor"></div>
	{/each}
</div>

<style>
	.meteor-sky {
		position: fixed;
		inset: 0;
		/* The background owns the only z-index: below all page content. */
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
		background:
			radial-gradient(90% 60% at 70% 0%, #101c38 0%, transparent 60%),
			linear-gradient(160deg, #0a0f1e 0%, #04060d 70%);
	}

	/* Sparse static stars so the sky is never empty between meteors. */
	.meteor-sky::before {
		content: '';
		position: absolute;
		width: 2px;
		height: 2px;
		border-radius: 50%;
		box-shadow:
			8vw 12vh 0 rgba(255, 255, 255, 0.5),
			15vw 68vh 0 rgba(255, 255, 255, 0.35),
			22vw 30vh 0 rgba(255, 255, 255, 0.6),
			30vw 85vh 0 rgba(255, 255, 255, 0.3),
			35vw 8vh 0 rgba(255, 255, 255, 0.55),
			42vw 45vh 0 rgba(255, 255, 255, 0.4),
			50vw 22vh 0 rgba(255, 255, 255, 0.6),
			55vw 74vh 0 rgba(255, 255, 255, 0.3),
			61vw 15vh 0 rgba(255, 255, 255, 0.5),
			67vw 52vh 0 rgba(255, 255, 255, 0.35),
			73vw 28vh 0 rgba(255, 255, 255, 0.55),
			78vw 80vh 0 rgba(255, 255, 255, 0.3),
			84vw 10vh 0 rgba(255, 255, 255, 0.5),
			90vw 40vh 0 rgba(255, 255, 255, 0.4),
			94vw 66vh 0 rgba(255, 255, 255, 0.5),
			12vw 88vh 0 rgba(255, 255, 255, 0.35),
			26vw 55vh 0 rgba(255, 255, 255, 0.45),
			47vw 90vh 0 rgba(255, 255, 255, 0.3),
			70vw 92vh 0 rgba(255, 255, 255, 0.4),
			88vw 22vh 0 rgba(255, 255, 255, 0.35),
			5vw 45vh 0 rgba(255, 255, 255, 0.3),
			38vw 25vh 0 rgba(255, 255, 255, 0.4),
			58vw 35vh 0 rgba(255, 255, 255, 0.5),
			80vw 60vh 0 rgba(255, 255, 255, 0.35);
	}

	.meteor {
		position: absolute;
		width: 120px;
		height: 2px;
		border-radius: 999px;
		/* Bright head at the leading (bottom-right) end, fading tail behind. */
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85));
		opacity: 0;
		animation: meteor-fly linear infinite;
	}

	/* Glowing head on the leading tip. */
	.meteor::after {
		content: '';
		position: absolute;
		right: 0;
		top: 50%;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #fff;
		transform: translateY(-50%);
		box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.6);
	}

	.meteor:nth-child(1) {
		top: -5%;
		left: 10%;
		animation-duration: 4.5s;
		animation-delay: 0.5s;
	}
	.meteor:nth-child(2) {
		top: 5%;
		left: 25%;
		animation-duration: 6s;
		animation-delay: 2.1s;
	}
	.meteor:nth-child(3) {
		top: -8%;
		left: 40%;
		animation-duration: 3.8s;
		animation-delay: 4s;
	}
	.meteor:nth-child(4) {
		top: 15%;
		left: 5%;
		animation-duration: 5.2s;
		animation-delay: 1.2s;
	}
	.meteor:nth-child(5) {
		top: 25%;
		left: -5%;
		animation-duration: 4s;
		animation-delay: 5.3s;
	}
	.meteor:nth-child(6) {
		top: 35%;
		left: 15%;
		animation-duration: 6.4s;
		animation-delay: 3.2s;
	}
	.meteor:nth-child(7) {
		top: 10%;
		left: 45%;
		animation-duration: 4.8s;
		animation-delay: 6.5s;
	}
	.meteor:nth-child(8) {
		top: -2%;
		left: 30%;
		animation-duration: 5.6s;
		animation-delay: 7.4s;
	}

	/* Rotate 45° so the bar's +x axis points from top-left to bottom-right,
	 * then travel along it; 170vmax clears the diagonal of any viewport. */
	@keyframes meteor-fly {
		0% {
			transform: rotate(45deg) translateX(-30vmax);
			opacity: 0;
		}
		6% {
			opacity: 1;
		}
		75% {
			opacity: 1;
		}
		100% {
			transform: rotate(45deg) translateX(170vmax);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.meteor {
			animation: none;
			opacity: 0;
		}
	}
</style>
