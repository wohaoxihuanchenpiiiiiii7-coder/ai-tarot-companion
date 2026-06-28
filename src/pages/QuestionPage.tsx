import { useState } from 'react'
import { PrimaryButton, SecondaryButton } from '../components/Buttons'
import {
  CategorySelector,
  type QuestionCategory,
} from '../components/CategorySelector'
import { SpreadSelector } from '../components/SpreadSelector'
import { optimizeMockQuestion } from '../lib/mockAi'
import type { ReadingSetup } from '../types/flow'
import type { SpreadType } from '../types/tarot'

interface QuestionPageProps {
  onContinue: (setup: ReadingSetup) => void
}

export function QuestionPage({ onContinue }: QuestionPageProps) {
  const [category, setCategory] = useState<QuestionCategory>('relationship')
  const [question, setQuestion] = useState('')
  const [optimizedQuestion, setOptimizedQuestion] = useState<string | null>(null)
  const [useOptimizedQuestion, setUseOptimizedQuestion] = useState(false)
  const [showSpreadSelection, setShowSpreadSelection] = useState(false)
  const [spreadType, setSpreadType] = useState<SpreadType>('one-card')
  const hasQuestion = question.trim().length > 0

  function resetAfterQuestionChange() {
    setOptimizedQuestion(null)
    setUseOptimizedQuestion(false)
    setShowSpreadSelection(false)
  }

  function handleCategoryChange(nextCategory: QuestionCategory) {
    setCategory(nextCategory)
    resetAfterQuestionChange()
  }

  function handleQuestionChange(value: string) {
    setQuestion(value)
    resetAfterQuestionChange()
  }

  function handleOptimize() {
    if (!hasQuestion) return

    const result = optimizeMockQuestion({
      category,
      rawQuestion: question,
    })

    setOptimizedQuestion(result.optimizedQuestion)
    setUseOptimizedQuestion(false)
    setShowSpreadSelection(false)
  }

  function handleContinue() {
    onContinue({
      mode: 'question',
      category,
      userQuestion: question.trim(),
      optimizedQuestion:
        useOptimizedQuestion && optimizedQuestion
          ? optimizedQuestion
          : undefined,
      spreadType,
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center sm:mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-plum-500">
          Ask a question
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-plum-950 sm:text-5xl">
          What is asking for your attention?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-500 sm:text-base">
          You do not need perfect words. Start with what feels present, and we
          will shape a gentler question together if you would like.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-card border border-plum-100 bg-white/65 p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-full bg-plum-800 text-xs font-bold text-white">
              1
            </span>
            <h2 className="font-serif text-xl font-semibold text-plum-950">
              Choose a focus
            </h2>
          </div>
          <CategorySelector value={category} onChange={handleCategoryChange} />
        </section>

        <section className="rounded-card border border-plum-100 bg-white/65 p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-full bg-plum-800 text-xs font-bold text-white">
              2
            </span>
            <h2 className="font-serif text-xl font-semibold text-plum-950">
              Share what is on your mind
            </h2>
          </div>
          <label htmlFor="tarot-question" className="sr-only">
            Your question or concern
          </label>
          <textarea
            id="tarot-question"
            value={question}
            onChange={(event) => handleQuestionChange(event.target.value)}
            rows={5}
            placeholder="For example: I feel uncertain about the direction of my relationship..."
            className="w-full resize-none rounded-2xl border border-plum-100 bg-cream-50/70 px-4 py-4 text-base leading-7 text-ink-800 outline-none transition placeholder:text-ink-300 focus:border-plum-400 focus:ring-4 focus:ring-plum-100"
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SecondaryButton onClick={handleOptimize} disabled={!hasQuestion}>
              <span aria-hidden="true">✦</span> Optimize with AI
            </SecondaryButton>
            <PrimaryButton
              disabled={!hasQuestion}
              onClick={() => {
                setUseOptimizedQuestion(false)
                setShowSpreadSelection(true)
              }}
            >
              Continue directly
            </PrimaryButton>
          </div>

          {optimizedQuestion && (
            <div className="mt-5 rounded-2xl border border-gold-300 bg-gold-100/70 p-4 sm:p-5">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-plum-600">
                A clearer reflection question
              </p>
              <p className="mt-2 font-serif text-lg leading-7 text-plum-950">
                “{optimizedQuestion}”
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <PrimaryButton
                  className="min-h-10 py-2"
                  onClick={() => {
                    setUseOptimizedQuestion(true)
                    setShowSpreadSelection(true)
                  }}
                >
                  Use this question
                </PrimaryButton>
                <SecondaryButton
                  className="min-h-10 py-2"
                  onClick={() => {
                    setUseOptimizedQuestion(false)
                    setShowSpreadSelection(true)
                  }}
                >
                  Keep my original
                </SecondaryButton>
              </div>
            </div>
          )}
        </section>

        {showSpreadSelection && (
          <section className="rounded-card border border-plum-200 bg-white/80 p-5 shadow-soft sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-full bg-plum-800 text-xs font-bold text-white">
                3
              </span>
              <div>
                <h2 className="font-serif text-xl font-semibold text-plum-950">
                  Choose your spread
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  How much space would you like to give this reflection?
                </p>
              </div>
            </div>
            <SpreadSelector value={spreadType} onChange={setSpreadType} />
            <PrimaryButton onClick={handleContinue} className="mt-5 w-full">
              Continue to card draw <span aria-hidden="true">→</span>
            </PrimaryButton>
          </section>
        )}
      </div>
    </div>
  )
}
