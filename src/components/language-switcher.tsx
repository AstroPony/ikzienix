'use client'

import { useLanguage } from '@/lib/i18n/context'
import { languages } from '@/lib/i18n/config'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {languages[language]}
      </button>
      <ul className="dropdown-menu">
        {Object.entries(languages).map(([code, name]) => (
          <li key={code}>
            <button
              className={`dropdown-item ${language === code ? 'active' : ''}`}
              onClick={() => setLanguage(code as keyof typeof languages)}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
} 