import type { ReactNode } from 'react'
import type { BilingualText } from '../content/copy'
import { BilingualLabel } from './BilingualLabel'

interface ResultSectionProps {
  label: BilingualText
  children: ReactNode
}

export function ResultSection({ label, children }: ResultSectionProps) {
  return (
    <section className="rounded-card border border-plum-100 bg-white/70 p-5 shadow-sm sm:p-7">
      <h2>
        <BilingualLabel {...label} variant="sectionTitle" />
      </h2>
      <div className="mt-5 text-[0.95rem] leading-8 text-ink-600">{children}</div>
    </section>
  )
}
