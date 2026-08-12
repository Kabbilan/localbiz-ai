'use client'

import { useEffect, useState } from 'react'

export function LanguageToggle() {
  const [language, setLanguage] = useState<'en' | 'ta'>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('localbiz-language')

    if (savedLanguage === 'ta' || savedLanguage === 'en') {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const nextLanguage = language === 'en' ? 'ta' : 'en'

    setLanguage(nextLanguage)
    localStorage.setItem('localbiz-language', nextLanguage)

    window.dispatchEvent(
      new CustomEvent('language-change', {
        detail: nextLanguage,
      }),
    )
  }

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
      aria-label="Change language"
    >
      {language === 'en' ? 'தமிழ்' : 'English'}
    </button>
  )
}
