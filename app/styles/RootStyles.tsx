import { Global, css } from '@emotion/react'

const baseStyles = css`
	* {
		box-sizing: border-box;
	}

	/* Set the selection as the default used by Safari */
	*::selection {
		background: #b4d5fe;
		color: #18181f;
	}

	html,
	body {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	html {
		scroll-behavior: smooth;
	}

	body {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		font-family: Overpass, sans-serif;
		font-weight: 400;

		&.ReactModal__Body--open {
			overflow: hidden;
		}
	}

	img,
	svg {
		vertical-align: bottom;
	}
	img {
		max-width: 100%;
		height: auto;
	}

	summary {
		cursor: pointer;
	}

	strong {
		font-weight: 700;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	pre,
	ul,
	ol {
		margin: 0;
	}
`

export default function RootStyles() {
	return <Global styles={baseStyles} />
}
