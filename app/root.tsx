import { css, withEmotionCache } from '@emotion/react'
import styled from '@emotion/styled'
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

export const links: LinksFunction = () => {
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
			href: 'https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100;0,400;0,600;0,800;0,900;1,100;1,400;1,600;1,800;1,900&display=swap',
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
		}, [])

		return (
			<html lang='en'>
				<head>
					{title ? <title>{title}</title> : null}
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
			<Outlet />
		</Document>
	)
}
