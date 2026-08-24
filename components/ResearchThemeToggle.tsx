'use client'

import { useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'

type ResearchTheme = 'light' | 'dark'

const STORAGE_KEY = 'maha-research-theme'
const THEME_CHANGE_EVENT = 'maha-research-theme-change'

function readTheme(): ResearchTheme {
  return document.documentElement.dataset.researchTheme === 'dark' ? 'dark' : 'light'
}

function applyTheme(theme: ResearchTheme) {
  document.documentElement.dataset.researchTheme = theme
  document.documentElement.style.colorScheme = theme
  localStorage.setItem(STORAGE_KEY, theme)
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

/**
 * A deliberately small client boundary: research pages remain server-rendered,
 * while a visitor can choose the light evidence-paper surface or the original
 * dark reading surface without sending that preference to a third party.
 */
export default function ResearchThemeToggle() {
  const pathname = usePathname()
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'dark')

  if (pathname.startsWith('/operator')) return null

  const nextTheme: ResearchTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      type="button"
      className="research-theme-toggle"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === 'dark'}
      onClick={() => applyTheme(nextTheme)}
    >
      <span aria-hidden="true">{theme === 'light' ? '◐' : '◑'}</span>
      <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
    </button>
  )
}
