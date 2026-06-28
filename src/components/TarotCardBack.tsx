import { copy } from '../content/copy'

interface TarotCardBackProps {
  index: number
  selected: boolean
  disabled?: boolean
  onSelect: (index: number) => void
}

export function TarotCardBack({
  index,
  selected,
  disabled = false,
  onSelect,
}: TarotCardBackProps) {
  return (
    <button
      type="button"
      aria-label={`${copy.draw.chooseCard(index)}${selected ? `，${copy.draw.chosen}` : ''}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(index)}
      className={`tarot-card-back group relative aspect-[2/3.35] w-full max-w-32 rounded-[1rem] p-1.5 shadow-card transition duration-300 sm:max-w-36 ${
        selected
          ? '-translate-y-3 rotate-1 ring-4 ring-gold-300/80'
          : 'hover:-translate-y-2 hover:-rotate-1'
      } disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:rotate-0`}
    >
      <span className="grid h-full w-full place-items-center rounded-[0.7rem] border border-gold-200/70">
        <span className="grid size-14 rotate-45 place-items-center border border-gold-200/60">
          <span className="-rotate-45 text-2xl text-gold-200">✦</span>
        </span>
      </span>
      {selected && (
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-300 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-plum-950">
          {copy.draw.chosen}
        </span>
      )}
    </button>
  )
}
