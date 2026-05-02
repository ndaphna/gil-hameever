import type { Metadata } from 'next'
import ClientComponent from './sharp-memory-client'

export const metadata: Metadata = {
  title: 'זיכרון חד בגיל המעבר — המדריך השלם',
  description: 'נכנסת לחדר ושכחת למה? המוח שלך לא נעלם — הוא בשיפוצים. גלי איך לשמור על זיכרון חד גם בגיל המעבר.',
  openGraph: {
    title: 'זיכרון חד בגיל המעבר — המדריך השלם',
    description: 'נכנסת לחדר ושכחת למה? המוח שלך לא נעלם — הוא בשיפוצים. גלי איך לשמור על זיכרון חד גם בגיל המעבר.',
  },
}

export default function Page() {
  return <ClientComponent />
}
