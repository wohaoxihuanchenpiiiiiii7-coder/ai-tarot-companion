import { useRef, useState } from 'react'
import { AppShell } from './components/AppShell'
import { DrawPage } from './pages/DrawPage'
import { HomePage } from './pages/HomePage'
import { QuestionPage } from './pages/QuestionPage'
import { ResultPage } from './pages/ResultPage'
import {
  clearRecentReadings,
  getRecentReadings,
  saveReading,
} from './lib/storage'
import type { CompletedReading, ReadingSetup } from './types/flow'
import type { ReadingResult } from './types/tarot'

type AppView = 'home' | 'question' | 'draw' | 'result'

function App() {
  const [view, setView] = useState<AppView>('home')
  const [readingSetup, setReadingSetup] = useState<ReadingSetup | null>(null)
  const [completedReading, setCompletedReading] =
    useState<CompletedReading | null>(null)
  const [recentReadings, setRecentReadings] =
    useState<ReadingResult[]>(getRecentReadings)
  const hasSavedCurrentReading = useRef(false)

  function returnHome() {
    setView('home')
    setReadingSetup(null)
    setCompletedReading(null)
  }

  function beginQuestionReading(setup: ReadingSetup) {
    hasSavedCurrentReading.current = false
    setReadingSetup(setup)
    setView('draw')
  }

  function beginDailyReading() {
    hasSavedCurrentReading.current = false
    setReadingSetup({
      mode: 'daily',
      category: 'daily',
      spreadType: 'one-card',
    })
    setView('draw')
  }

  function finishReading(reading: CompletedReading) {
    if (hasSavedCurrentReading.current) return

    hasSavedCurrentReading.current = true
    const savedReading: ReadingResult = {
      id: globalThis.crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...reading.input,
      ...reading.output,
    }

    setRecentReadings(saveReading(savedReading))
    setCompletedReading(reading)
    setView('result')
  }

  function handleClearHistory() {
    clearRecentReadings()
    setRecentReadings([])
  }

  function renderView() {
    if (view === 'question') {
      return <QuestionPage onContinue={beginQuestionReading} />
    }

    if (view === 'draw' && readingSetup) {
      return (
        <DrawPage
          setup={readingSetup}
          onBack={() =>
            setView(readingSetup.mode === 'daily' ? 'home' : 'question')
          }
          onComplete={finishReading}
        />
      )
    }

    if (view === 'result' && completedReading) {
      return <ResultPage reading={completedReading} onHome={returnHome} />
    }

    return (
      <HomePage
        onAskQuestion={() => setView('question')}
        onDailyTarot={beginDailyReading}
        recentReadings={recentReadings}
        onClearHistory={handleClearHistory}
      />
    )
  }

  return <AppShell onHome={returnHome}>{renderView()}</AppShell>
}

export default App
