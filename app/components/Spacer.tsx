import { css } from '@emotion/react'

interface SpacerProps {
	unit: number
}

export default function Spacer({ unit }: SpacerProps) {
	return (
		<div
			css={css`
				width: ${unit + 8}px;
				height: ${unit + 8}px;
			`}
		/>
	)
}
