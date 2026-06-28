import type { ReactNode } from 'react'
import { copy } from '../content/copy'
import { BilingualLabel } from './BilingualLabel'

interface AppShellProps {
  children: ReactNode
  onHome: () => void
}

export function AppShell({ children, onHome }: AppShellProps) {
  return (
    <div className="app-background min-h-screen text-ink-900">
      <header className="px-5 pt-5 sm:px-8 sm:pt-7">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button
            type="button"
            onClick={onHome}
            className="group flex items-center gap-3 text-left"
            aria-label={`${copy.result.backHome.zh} / ${copy.result.backHome.en}`}
          >
            <span className="grid size-10 place-items-center rounded-full border border-plum-200 bg-cream-50 text-lg text-plum-700 shadow-sm transition group-hover:-rotate-6">
              ✦
            </span>
            <BilingualLabel {...copy.brand.name} variant="helper" />
          </button>
          <span className="hidden rounded-full border border-plum-100 bg-white/60 px-4 py-2 sm:block">
            <BilingualLabel
              {...copy.brand.headerNote}
              variant="helper"
              tone="muted"
              align="center"
            />
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        {children}
      </main>
    </div>
  )
}
