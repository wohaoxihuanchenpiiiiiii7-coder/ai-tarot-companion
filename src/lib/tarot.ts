import { majorArcana } from '../data/majorArcana'
import type {
  CardOrientation,
  DrawnCard,
  TarotCard,
  ThreeCardPosition,
} from '../types/tarot'

const THREE_CARD_POSITIONS: ThreeCardPosition[] = [
  'current situation',
  'hidden cause',
  'action suggestion',
]

export function getRandomOrientation(): CardOrientation {
  return Math.random() < 0.5 ? 'upright' : 'reversed'
}

export function drawOneCard(): DrawnCard {
  const randomIndex = Math.floor(Math.random() * majorArcana.length)

  return {
    card: majorArcana[randomIndex],
    orientation: getRandomOrientation(),
  }
}

export function drawThreeCards(): DrawnCard[] {
  const shuffledCards = [...majorArcana]

  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const selectedCard = shuffledCards[randomIndex]

    shuffledCards[randomIndex] = shuffledCards[index]
    shuffledCards[index] = selectedCard
  }

  return shuffledCards.slice(0, THREE_CARD_POSITIONS.length).map((card, index) => ({
    card,
    orientation: getRandomOrientation(),
    position: THREE_CARD_POSITIONS[index],
  }))
}

export function getCardById(id: string): TarotCard | undefined {
  return majorArcana.find((card) => card.id === id)
}
