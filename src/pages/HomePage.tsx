import { BilingualLabel } from '../components/BilingualLabel'
import { PrimaryButton, SecondaryButton } from '../components/Buttons'
import { copy } from '../content/copy'

interface HomePageProps {
  onAskQuestion: () => void
  onDailyTarot: () => void
}

export function HomePage({ onAskQuestion, onDailyTarot }: HomePageProps) {
  return (
    <div className="space-y-14 sm:space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="max-w-2xl">
          <BilingualLabel
            {...copy.home.eyebrow}
            variant="helper"
            className="mb-5"
          />
          <h1>
            <BilingualLabel {...copy.home.title} variant="hero" />
          </h1>
          <p className="mt-7 font-serif text-xl font-semibold leading-8 text-plum-800 sm:text-2xl">
            {copy.home.subtitle}
          </p>
          <p className="mt-4 max-w-xl text-base leading-8 text-ink-600">
            {copy.home.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton
              onClick={onAskQuestion}
              className="gap-3 sm:min-w-48"
            >
              <BilingualLabel
                {...copy.home.askQuestion}
                variant="button"
                tone="inverse"
                align="center"
              />
              <span aria-hidden="true">→</span>
            </PrimaryButton>
            <SecondaryButton
              onClick={onDailyTarot}
              className="gap-3 sm:min-w-48"
            >
              <BilingualLabel
                {...copy.home.dailyTarot}
                variant="button"
                align="center"
              />
              <span aria-hidden="true">✦</span>
            </SecondaryButton>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-ink-400">
            <span className="size-1.5 rounded-full bg-gold-400" />
            {copy.home.mockNote}
          </p>
        </div>

        <div className="relative mx-auto h-[22rem] w-full max-w-sm sm:h-[27rem]">
          <div className="absolute inset-x-8 bottom-3 top-12 rotate-6 rounded-[2rem] border border-plum-200 bg-plum-200/40" />
          <div className="tarot-card-back absolute inset-x-10 bottom-7 top-7 -rotate-3 rounded-[2rem] p-3 shadow-card">
            <div className="grid h-full place-items-center rounded-[1.4rem] border border-gold-200/70">
              <div className="text-center text-gold-200">
                <p className="text-6xl">☾</p>
                <p className="mt-4 text-sm font-semibold tracking-[0.3em]">
                  {copy.home.cardMessage}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 grid size-20 place-items-center rounded-full border border-gold-300 bg-gold-200 px-2 text-center font-serif text-sm text-plum-900 shadow-soft">
            {copy.home.cardWhisper}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2>
            <BilingualLabel
              {...copy.home.recentReadings}
              variant="sectionTitle"
            />
          </h2>
          <span className="text-xs text-ink-400">{copy.home.latestThree}</span>
        </div>
        <div className="rounded-card border border-dashed border-plum-200 bg-white/45 px-5 py-10 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-plum-50 text-plum-500">
            ✧
          </span>
          <p className="mt-4 font-serif text-xl font-semibold text-plum-900">
            {copy.home.emptyTitle}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500">
            {copy.home.emptyDescription}
          </p>
        </div>
      </section>
    </div>
  )
}
