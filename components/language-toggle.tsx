'use client'

import { useState } from 'react'

export function LanguageToggle() {
  const [language, setLanguage] = useState<'en' | 'ta'>('en')

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'))
  }

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
    >
      {language === 'en' ? 'தமிழ்' : 'English'}
    </button>
  )
}
