'use client'

import { useEffect, useState } from 'react'

export function LiveGreeting() {
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()

      const formatted = now.toLocaleString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

      setDateTime(formatted)
    }

    updateDateTime()

    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <h2 className="font-display text-2xl font-bold tracking-tight">
        Good morning, Ravi
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        {dateTime}
      </p>

      <p className="mt-1 text-muted-foreground">
        Here&apos;s what&apos;s happening with your shop today.
      </p>
    </>
  )
}
