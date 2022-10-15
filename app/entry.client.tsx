import { CacheProvider } from '@emotion/react'
import { RemixBrowser } from '@remix-run/react'
import { useState, useCallback } from 'react'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import ClientStyleContext from '~/styles/client.context'
import createEmotionCache from '~/styles/createEmotionCache'

interface ClientCacheProviderProps {
	children: React.ReactNode
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
	const [cache, setCache] = useState(() => createEmotionCache())

	const reset = useCallback(() => {
		setCache(createEmotionCache())
	}, [])

	return (
		<ClientStyleContext.Provider value={{ reset }}>
			<CacheProvider value={cache}>{children}</CacheProvider>
		</ClientStyleContext.Provider>
	)
}

const hydrate = () => {
	startTransition(() => {
		hydrateRoot(
			document,
			<StrictMode>
				<ClientCacheProvider>
					<RemixBrowser />
				</ClientCacheProvider>
			</StrictMode>,
		)
	})
}

if (window.requestIdleCallback) {
	window.requestIdleCallback(hydrate)
} else {
	// Safari doesn't support requestIdleCallback
	// https://caniuse.com/requestidlecallback
	window.setTimeout(hydrate, 1)
}
