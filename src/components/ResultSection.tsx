import type { ReactNode } from 'react'

interface ResultSectionProps {
  eyebrow: string
  title: string
  children: ReactNode
}

export function ResultSection({ eyebrow, title, children }: ResultSectionProps) {
  return (
    <section className="rounded-card border border-plum-100 bg-white/70 p-5 shadow-sm sm:p-7">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-plum-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-plum-950">
        {title}
      </h2>
      <div className="mt-4 text-[0.95rem] leading-7 text-ink-600">{children}</div>
    </section>
  )
}
