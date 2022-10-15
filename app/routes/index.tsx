import { css } from '@emotion/react'
import { Link } from '@remix-run/react'
import { useState } from 'react'

import { useOptionalUser } from '~/utils'

export default function Index() {
	const user = useOptionalUser()
	const [color, setColor] = useState('pink')

	return (
		<main
			css={css`
				flex-grow: 1;
				background: ${color};
			`}
		>
			<button onClick={() => setColor(color === 'pink' ? 'lightblue' : 'pink')}>
				Change color
			</button>
			<div className='relative sm:pb-16 sm:pt-8'>
				<div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
					<h1>Tao</h1>
					<p className='mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl'>
						Check the README.md file for instructions on how to get this project
						deployed.
					</p>
					<div className='mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center'>
						{user ? (
							<Link
								to='/notes'
								className='flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8'
							>
								View Notes for {user.email}
							</Link>
						) : (
							<div className='space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0'>
								<Link
									to='/join'
									className='flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8'
								>
									Sign up
								</Link>
								<Link
									to='/login'
									className='flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600'
								>
									Log In
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	)
}
