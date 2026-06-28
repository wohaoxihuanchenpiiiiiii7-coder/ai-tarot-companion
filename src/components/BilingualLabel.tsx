import type { BilingualText } from '../content/copy'

type BilingualLabelVariant =
  | 'hero'
  | 'pageTitle'
  | 'sectionTitle'
  | 'button'
  | 'option'
  | 'helper'

type BilingualLabelTone = 'default' | 'muted' | 'inverse' | 'gold'

interface BilingualLabelProps extends BilingualText {
  variant?: BilingualLabelVariant
  tone?: BilingualLabelTone
  align?: 'left' | 'center'
  className?: string
}

const variantClasses: Record<
  BilingualLabelVariant,
  { zh: string; en: string; gap: string }
> = {
  hero: {
    zh: 'font-serif text-5xl font-semibold leading-none tracking-[-0.035em] sm:text-6xl lg:text-7xl',
    en: 'font-serif text-base font-medium tracking-[0.08em] sm:text-lg',
    gap: 'mt-3',
  },
  pageTitle: {
    zh: 'font-serif text-4xl font-semibold leading-tight sm:text-5xl',
    en: 'text-xs font-semibold uppercase tracking-[0.2em]',
    gap: 'mt-2',
  },
  sectionTitle: {
    zh: 'font-serif text-xl font-semibold leading-tight sm:text-2xl',
    en: 'text-[0.65rem] font-semibold uppercase tracking-[0.18em]',
    gap: 'mt-1.5',
  },
  button: {
    zh: 'text-sm font-semibold leading-none',
    en: 'text-[0.6rem] font-medium uppercase tracking-[0.12em]',
    gap: 'mt-1',
  },
  option: {
    zh: 'font-serif text-lg font-semibold leading-none',
    en: 'text-[0.65rem] font-semibold uppercase tracking-[0.12em]',
    gap: 'mt-1.5',
  },
  helper: {
    zh: 'text-xs font-semibold leading-none',
    en: 'text-[0.58rem] font-medium uppercase tracking-[0.14em]',
    gap: 'mt-1',
  },
}

const toneClasses: Record<BilingualLabelTone, { zh: string; en: string }> = {
  default: { zh: 'text-plum-950', en: 'text-plum-500' },
  muted: { zh: 'text-ink-600', en: 'text-ink-400' },
  inverse: { zh: 'text-white', en: 'text-white/60' },
  gold: { zh: 'text-cream-50', en: 'text-gold-300' },
}

export function BilingualLabel({
  zh,
  en,
  variant = 'option',
  tone = 'default',
  align = 'left',
  className = '',
}: BilingualLabelProps) {
  const variantClass = variantClasses[variant]
  const toneClass = toneClasses[tone]

  return (
    <span
      className={`flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'} ${className}`}
    >
      <span lang="zh-CN" className={`${variantClass.zh} ${toneClass.zh}`}>
        {zh}
      </span>
      <span
        lang="en"
        className={`${variantClass.gap} ${variantClass.en} ${toneClass.en}`}
      >
        {en}
      </span>
    </span>
  )
}
