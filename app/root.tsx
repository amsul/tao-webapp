import { withEmotionCache } from '@emotion/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import normalizeStyles from 'normalize.css'
import { useContext, useEffect } from 'react'

import { getUser } from '~/session.server'
import RootStyles from '~/styles/RootStyles'
import ClientStyleContext from '~/styles/client.context'
import ServerStyleContext from '~/styles/server.context'

const theme = createTheme({
	typography: {
		fontFamily: [
			'Overpass',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: ({ ownerState }) => ({
					fontWeight: 900,
				}),
			},
		},
	},
})

export const links: LinksFunction = () => {
	const weights = [100, 400, 600, 800, 900]
	return [
		{
			rel: 'preconnect',
			href: 'https://fonts.googleapis.com',
		},
		{
			rel: 'preconnect',
			href: 'https://fonts.gstatic.com',
			crossOrigin: 'anonymous',
		},
		{
			rel: 'stylesheet',
			href: [
				'https://fonts.googleapis.com/css2?family=Overpass:ital,wght@',
				weights.map((weight) => `0,${weight}`).join(';'),
				';',
				weights.map((weight) => `1,${weight}`).join(';'),
				'&display=swap',
			].join(''),
		},
		{
			rel: 'stylesheet',
			href: normalizeStyles,
		},
	]
}

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Tao',
	viewport: 'width=device-width,initial-scale=1',
})

export async function loader({ request }: LoaderArgs) {
	return json({
		user: await getUser(request),
	})
}

interface DocumentProps {
	children: React.ReactNode
	title?: string
}

const Document = withEmotionCache(
	({ children, title }: DocumentProps, emotionCache) => {
		const serverStyleData = useContext(ServerStyleContext)
		const clientStyleData = useContext(ClientStyleContext)

		// Only executed on client
		useEffect(() => {
			// re-link sheet container
			emotionCache.sheet.container = document.head

			// re-inject tags
			const tags = emotionCache.sheet.tags
			emotionCache.sheet.flush()
			tags.forEach((tag) => {
				;(emotionCache.sheet as any)._insertTag(tag)
			})

			// reset cache to re-apply global styles
			clientStyleData.reset()
		}, []) // eslint-disable-line react-hooks/exhaustive-deps

		return (
			<html lang='en'>
				<head>
					{title != null ? <title>{title}</title> : null}
					<Meta />
					<Links />
					{serverStyleData?.map(({ key, ids, css }) => (
						<style
							key={key}
							data-emotion={`${key} ${ids.join(' ')}`}
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{ __html: css }}
						/>
					))}
					<RootStyles />
				</head>
				<body>
					{children}
					<ScrollRestoration />
					<Scripts />
					<LiveReload />
				</body>
			</html>
		)
	},
)

export default function App() {
	return (
		<Document>
			<ThemeProvider theme={theme}>
				<Outlet />
			</ThemeProvider>
		</Document>
	)
}
