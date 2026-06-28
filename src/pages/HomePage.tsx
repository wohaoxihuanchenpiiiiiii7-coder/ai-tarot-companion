import { PrimaryButton, SecondaryButton } from '../components/Buttons'

interface HomePageProps {
  onAskQuestion: () => void
  onDailyTarot: () => void
}

export function HomePage({ onAskQuestion, onDailyTarot }: HomePageProps) {
  return (
    <div className="space-y-14 sm:space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-plum-600">
            Pause · Reflect · Move gently
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-plum-950 sm:text-6xl lg:text-7xl">
            A little clarity,
            <span className="mt-2 block italic text-plum-600">held with care.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-ink-600 sm:text-lg sm:leading-8">
            Use tarot as a gentle mirror for what you are feeling—not a fixed
            prediction, but a quiet place to notice patterns and find your next
            small step.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton onClick={onAskQuestion} className="sm:min-w-44">
              Ask a question <span aria-hidden="true">→</span>
            </PrimaryButton>
            <SecondaryButton onClick={onDailyTarot} className="sm:min-w-44">
              Daily tarot <span aria-hidden="true">✦</span>
            </SecondaryButton>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-ink-400">
            <span className="size-1.5 rounded-full bg-gold-400" />
            Your reading is generated locally with mock AI for now.
          </p>
        </div>

        <div className="relative mx-auto h-[22rem] w-full max-w-sm sm:h-[27rem]">
          <div className="absolute inset-x-8 bottom-3 top-12 rotate-6 rounded-[2rem] border border-plum-200 bg-plum-200/40" />
          <div className="tarot-card-back absolute inset-x-10 bottom-7 top-7 -rotate-3 rounded-[2rem] p-3 shadow-card">
            <div className="grid h-full place-items-center rounded-[1.4rem] border border-gold-200/70">
              <div className="text-center text-gold-200">
                <p className="text-6xl">☾</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.35em]">
                  Look within
                </p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 grid size-20 place-items-center rounded-full border border-gold-300 bg-gold-200 font-serif text-sm italic text-plum-900 shadow-soft">
            Be here
            <br /> now
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-plum-500">
              Your space
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-plum-950">
              Recent reflections
            </h2>
          </div>
          <span className="text-xs text-ink-400">Latest 3</span>
        </div>
        <div className="rounded-card border border-dashed border-plum-200 bg-white/45 px-5 py-10 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-plum-50 text-plum-500">
            ✧
          </span>
          <p className="mt-4 font-serif text-xl font-semibold text-plum-900">
            Your reflections will gather here
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500">
            Complete a reading to begin. Recent-reading storage will be connected
            in a later step.
          </p>
        </div>
      </section>
    </div>
  )
}
