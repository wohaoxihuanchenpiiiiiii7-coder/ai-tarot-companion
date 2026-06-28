import { copy } from '../content/copy'
import { BilingualLabel } from './BilingualLabel'
import { PrimaryButton } from './Buttons'

interface GenerationNoticeProps {
  kind: 'error' | 'limit'
  message: string
  onRetry?: () => void
}

export function GenerationNotice({
  kind,
  message,
  onRetry,
}: GenerationNoticeProps) {
  const title =
    kind === 'limit'
      ? copy.generation.dailyLimitReached
      : copy.generation.errorTitle

  return (
    <div
      className={`mx-auto rounded-card border p-5 text-left shadow-sm ${
        kind === 'limit'
          ? 'border-gold-300 bg-gold-100/80'
          : 'border-plum-200 bg-white/80'
      }`}
      role="status"
    >
      <BilingualLabel {...title} variant="sectionTitle" />
      <p className="mt-4 text-sm leading-7 text-ink-600">{message}</p>
      {kind === 'error' && onRetry && (
        <PrimaryButton onClick={onRetry} className="mt-5">
          <BilingualLabel
            {...copy.result.retry}
            variant="button"
            tone="inverse"
            align="center"
          />
        </PrimaryButton>
      )}
    </div>
  )
}
