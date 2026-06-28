import type { ReactNode } from 'react'

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
            aria-label="Return to home"
          >
            <span className="grid size-10 place-items-center rounded-full border border-plum-200 bg-cream-50 text-lg text-plum-700 shadow-sm transition group-hover:-rotate-6">
              ✦
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold leading-none text-plum-950">
                Arcana
              </span>
              <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-plum-500">
                AI Tarot Companion
              </span>
            </span>
          </button>
          <span className="hidden rounded-full border border-plum-100 bg-white/60 px-3 py-1.5 text-xs text-plum-600 sm:block">
            A gentle space to reflect
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        {children}
      </main>
    </div>
  )
}
