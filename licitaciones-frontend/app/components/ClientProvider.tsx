// components/ClientProvider.tsx
'use client'

import { useEffect, useState } from 'react'

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true)
  }, [])

  return (
    <div suppressHydrationWarning>
      {isClient ? children : null}
    </div>
  )
}