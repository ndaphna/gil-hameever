import type { Metadata } from 'next'
import ClientComponent from './cortisol-client'

export const metadata: Metadata = {
  title: 'קורטיזול ולחץ בגיל המעבר — איך מורידים את האש',
  description: 'קורטיזול גבוה בגיל המעבר מחמיר תסמינים וגורם ללחץ כרוני. גלי איך לווסת את הורמון הסטרס ולהרגיש טוב יותר.',
  openGraph: {
    title: 'קורטיזול ולחץ בגיל המעבר — איך מורידים את האש',
    description: 'קורטיזול גבוה בגיל המעבר מחמיר תסמינים וגורם ללחץ כרוני. גלי איך לווסת את הורמון הסטרס ולהרגיש טוב יותר.',
  },
}

export default function Page() {
  return <ClientComponent />
}
