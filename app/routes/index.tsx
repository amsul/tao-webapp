import { css } from '@emotion/react'
import { Link } from '@remix-run/react'

import { Heading1 } from '~/components/Text'
import taoIconUrl from '~/images/tao.svg'
import { useOptionalUser } from '~/utils'

export default function Index() {
	const user = useOptionalUser()

	return (
		<main>
			<div>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						align-items: center;
					`}
				>
					<Heading1>Tao</Heading1>
					<img
						src={taoIconUrl}
						alt='Tao'
						css={css`
							width: 160px;
							height 160px;
						`}
					/>
				</div>
				<div
					css={css`
						display: none;
					`}
				>
					{user ? (
						<Link to='/notes'>View Notes for {user.email}</Link>
					) : (
						<div>
							<Link to='/join'>Sign up</Link>
							<Link to='/login'>Log In</Link>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
