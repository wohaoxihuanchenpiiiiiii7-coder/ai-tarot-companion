import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { DrawPage } from './pages/DrawPage'
import { HomePage } from './pages/HomePage'
import { QuestionPage } from './pages/QuestionPage'
import { ResultPage } from './pages/ResultPage'
import type { CompletedReading, ReadingSetup } from './types/flow'

type AppView = 'home' | 'question' | 'draw' | 'result'

function App() {
  const [view, setView] = useState<AppView>('home')
  const [readingSetup, setReadingSetup] = useState<ReadingSetup | null>(null)
  const [completedReading, setCompletedReading] =
    useState<CompletedReading | null>(null)

  function returnHome() {
    setView('home')
    setReadingSetup(null)
    setCompletedReading(null)
  }

  function beginQuestionReading(setup: ReadingSetup) {
    setReadingSetup(setup)
    setView('draw')
  }

  function beginDailyReading() {
    setReadingSetup({
      mode: 'daily',
      category: 'daily',
      spreadType: 'one-card',
    })
    setView('draw')
  }

  function finishReading(reading: CompletedReading) {
    setCompletedReading(reading)
    setView('result')
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
      />
    )
  }

  return <AppShell onHome={returnHome}>{renderView()}</AppShell>
}

export default App
