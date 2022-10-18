import { css } from '@emotion/react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { Link } from '@remix-run/react'
import ReactQRCode from 'react-qr-code'

import Spacer from '~/components/Spacer'
import { Heading1 } from '~/components/Text'
import taoIconUrl from '~/images/tao.svg'
import { useOptionalUser } from '~/utils'

export async function action({ request }: ActionArgs) {
	const formData = await request.formData()
	const sats = formData.get('sats')

	if (typeof sats !== 'string' || sats === '' || !/^\d+$/.test(sats)) {
		return json(
			{
				error: 'invalid_input',
				invoice: null,
			},
			{ status: 400 },
		)
	}

	const amountSats = Number(sats)
	if (amountSats < 1000) {
		return json(
			{
				error: 'low_sats',
				invoice: null,
			},
			{ status: 400 },
		)
	}

	console.log(`Valid sats amount ${amountSats}`)

	const { default: TaoWallet } = await import('tao-wallet')
	const crypto = await import('crypto')
	const lnmSecret = crypto.randomBytes(16).toString('hex')

	const network = process.env.TESTNET === 'true' ? 'testnet' : 'mainnet'
	console.log(`Using network ${network}`)

	const tao = new TaoWallet({
		lnmSecret,
		network,
	})

	await tao.login()

	const invoice: string = await tao.fetchDepositAddress({
		type: 'bolt11',
		amountSats,
	})

	return json({
		error: null,
		invoice,
	})
}

export default function Index() {
	const user = useOptionalUser()
	const actionData = useActionData<typeof action>()

	// const invoice =
	// 	'lntb345670n1p35h8lapp5gs5rywply2sfgduflqvw3t0nq3sw3gvtzztnscqhzejvm7f9texqdqaf38zqntpwf4k2arnypzx2ur0wd5hgcqzpgxqzz6sp5zc3r2dsan3rkggfsdkd8eva3enwurt4lpy6q7varalstx3n74ras9qyyssq68yhtrgh4e78v8nwpdye7sxdl6waup56gfuyt0n92z0cfquzsdujdsur6cml8f45959eaz834m03hr8j68tf2hthuwtxq2magmp47fgp96aqy6'
	// console.log({ actionData })

	return (
		<main>
			<Container maxWidth='sm'>
				<Spacer unit={20} />

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

				<Spacer unit={10} />

				<Form method='post'>
					<Stack spacing={2}>
						{actionData?.error != null && (
							<Alert severity='error'>{actionData.error}</Alert>
						)}
						<TextField
							label='Enter sats'
							name='sats'
						/>
						<Button
							size='large'
							variant='contained'
							type='submit'
						>
							Generate lightning invoice
						</Button>
					</Stack>
				</Form>

				{actionData?.invoice != null && (
					<>
						<Spacer unit={40} />
						<div>
							<Card
								variant='elevation'
								elevation={4}
								css={css`
									width: 320px;
									margin: 0 auto;
								`}
							>
								<CardMedia>
									<ReactQRCode
										value={actionData.invoice}
										size={320}
									/>
								</CardMedia>
								<CardContent>
									<Typography
										css={css`
											text-align: center;
											word-wrap: break-word;
										`}
									>
										{actionData.invoice.slice(0, 12)}…
										{actionData.invoice.slice(-12)}
									</Typography>
								</CardContent>
							</Card>
						</div>
					</>
				)}

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
			</Container>
		</main>
	)
}
