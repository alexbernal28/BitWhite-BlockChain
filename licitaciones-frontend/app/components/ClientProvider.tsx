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
    setIsClient(true)
  }, [])

  return (
    <div suppressHydrationWarning>
      {isClient ? children : null}
    </div>
  )
}