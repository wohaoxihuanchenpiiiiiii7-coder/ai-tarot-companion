import { useEffect, useRef, useState } from 'react'
import { BilingualLabel } from '../components/BilingualLabel'
import { PrimaryButton, SecondaryButton } from '../components/Buttons'
import {
  CategorySelector,
  type QuestionCategory,
} from '../components/CategorySelector'
import { GenerationNotice } from '../components/GenerationNotice'
import { SpreadSelector } from '../components/SpreadSelector'
import { copy } from '../content/copy'
import { optimizeMockQuestion } from '../lib/mockAi'
import {
  canOptimizeQuestion,
  recordQuestionOptimization,
} from '../lib/usageLimit'
import type { ReadingSetup } from '../types/flow'
import type { SpreadType } from '../types/tarot'

interface QuestionPageProps {
  onContinue: (setup: ReadingSetup) => void
}

type OptimizationError = 'error' | 'limit' | null

const MOCK_OPTIMIZATION_DELAY = 650

export function QuestionPage({ onContinue }: QuestionPageProps) {
  const [category, setCategory] = useState<QuestionCategory>('relationship')
  const [question, setQuestion] = useState('')
  const [optimizedQuestion, setOptimizedQuestion] = useState<string | null>(null)
  const [useOptimizedQuestion, setUseOptimizedQuestion] = useState(false)
  const [showSpreadSelection, setShowSpreadSelection] = useState(false)
  const [spreadType, setSpreadType] = useState<SpreadType>('one-card')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationError, setOptimizationError] =
    useState<OptimizationError>(null)
  const optimizationLock = useRef(false)
  const isMounted = useRef(true)
  const hasQuestion = question.trim().length > 0

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  function resetAfterQuestionChange() {
    setOptimizedQuestion(null)
    setUseOptimizedQuestion(false)
    setShowSpreadSelection(false)
    setOptimizationError(null)
  }

  function handleCategoryChange(nextCategory: QuestionCategory) {
    setCategory(nextCategory)
    resetAfterQuestionChange()
  }

  function handleQuestionChange(value: string) {
    setQuestion(value)
    resetAfterQuestionChange()
  }

  async function handleOptimize() {
    if (!hasQuestion || optimizationLock.current) return

    if (!canOptimizeQuestion()) {
      setOptimizationError('limit')
      return
    }

    optimizationLock.current = true
    setIsOptimizing(true)
    setOptimizationError(null)
    setOptimizedQuestion(null)
    setUseOptimizedQuestion(false)
    setShowSpreadSelection(false)
    recordQuestionOptimization()

    try {
      await new Promise((resolve) =>
        window.setTimeout(resolve, MOCK_OPTIMIZATION_DELAY),
      )
      const result = optimizeMockQuestion({ category, rawQuestion: question })

      if (!isMounted.current) return

      setOptimizedQuestion(result.optimizedQuestion)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Question optimization failed', error)
      }

      if (isMounted.current) {
        setOptimizationError('error')
      }
    } finally {
      optimizationLock.current = false

      if (isMounted.current) {
        setIsOptimizing(false)
      }
    }
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
        <h1>
          <BilingualLabel
            {...copy.question.pageTitle}
            variant="pageTitle"
            align="center"
          />
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink-500 sm:text-base">
          {copy.question.pageDescription}
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-card border border-plum-100 bg-white/65 p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-plum-800 text-xs font-bold text-white">
              1
            </span>
            <h2>
              <BilingualLabel
                {...copy.question.categoryTitle}
                variant="sectionTitle"
              />
            </h2>
          </div>
          <CategorySelector
            value={category}
            onChange={handleCategoryChange}
            disabled={isOptimizing}
          />
        </section>

        <section className="rounded-card border border-plum-100 bg-white/65 p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-plum-800 text-xs font-bold text-white">
              2
            </span>
            <h2>
              <BilingualLabel
                {...copy.question.questionTitle}
                variant="sectionTitle"
              />
            </h2>
          </div>
          <label htmlFor="tarot-question" className="sr-only">
            {copy.question.questionTitle.zh}
          </label>
          <textarea
            id="tarot-question"
            value={question}
            onChange={(event) => handleQuestionChange(event.target.value)}
            disabled={isOptimizing}
            rows={5}
            placeholder={copy.question.questionPlaceholder}
            className="w-full resize-none rounded-2xl border border-plum-100 bg-cream-50/70 px-4 py-4 text-base leading-7 text-ink-800 outline-none transition placeholder:text-ink-300 focus:border-plum-400 focus:ring-4 focus:ring-plum-100"
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SecondaryButton
              onClick={handleOptimize}
              disabled={!hasQuestion || isOptimizing}
              className="gap-3"
            >
              <span aria-hidden="true">✦</span>
              <BilingualLabel
                {...(isOptimizing
                  ? copy.generation.refiningQuestion
                  : copy.question.refine)}
                variant="button"
                align="center"
              />
            </SecondaryButton>
            <PrimaryButton
              disabled={!hasQuestion || isOptimizing}
              onClick={() => {
                setUseOptimizedQuestion(false)
                setShowSpreadSelection(true)
              }}
            >
              <BilingualLabel
                {...copy.question.drawDirectly}
                variant="button"
                tone="inverse"
                align="center"
              />
            </PrimaryButton>
          </div>

          {optimizationError && (
            <div className="mt-5">
              <GenerationNotice
                kind={optimizationError}
                message={
                  optimizationError === 'limit'
                    ? copy.generation.dailyLimitDescription
                    : copy.generation.optimizationError
                }
                onRetry={
                  optimizationError === 'error'
                    ? () => void handleOptimize()
                    : undefined
                }
              />
            </div>
          )}

          {optimizedQuestion && (
            <div className="mt-5 rounded-2xl border border-gold-300 bg-gold-100/70 p-4 sm:p-5">
              <BilingualLabel
                {...copy.question.refinedTitle}
                variant="helper"
              />
              <p className="mt-3 font-serif text-lg leading-8 text-plum-950">
                {optimizedQuestion}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <PrimaryButton
                  className="min-h-11 py-2"
                  onClick={() => {
                    setUseOptimizedQuestion(true)
                    setShowSpreadSelection(true)
                  }}
                >
                  <BilingualLabel
                    {...copy.question.useQuestion}
                    variant="button"
                    tone="inverse"
                    align="center"
                  />
                </PrimaryButton>
                <SecondaryButton
                  className="min-h-11 py-2"
                  onClick={() => {
                    setUseOptimizedQuestion(false)
                    setShowSpreadSelection(true)
                  }}
                >
                  <BilingualLabel
                    {...copy.question.keepOriginal}
                    variant="button"
                    align="center"
                  />
                </SecondaryButton>
              </div>
            </div>
          )}
        </section>

        {showSpreadSelection && (
          <section className="rounded-card border border-plum-200 bg-white/80 p-5 shadow-soft sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-plum-800 text-xs font-bold text-white">
                3
              </span>
              <div>
                <h2>
                  <BilingualLabel
                    {...copy.question.spreadTitle}
                    variant="sectionTitle"
                  />
                </h2>
                <p className="mt-2 text-sm text-ink-500">
                  {copy.question.spreadHelper}
                </p>
              </div>
            </div>
            <SpreadSelector value={spreadType} onChange={setSpreadType} />
            <PrimaryButton onClick={handleContinue} className="mt-5 w-full gap-3">
              <BilingualLabel
                {...copy.question.continueToDraw}
                variant="button"
                tone="inverse"
                align="center"
              />
              <span aria-hidden="true">→</span>
            </PrimaryButton>
          </section>
        )}
      </div>
    </div>
  )
}
