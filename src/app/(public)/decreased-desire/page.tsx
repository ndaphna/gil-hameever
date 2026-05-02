import type { Metadata } from 'next'
import ClientComponent from './decreased-desire-client'

export const metadata: Metadata = {
  title: 'ירידה בחשק המיני בגיל המעבר — זה נורמלי ויש פתרון',
  description: 'ירידה בחשק מיני בגיל המעבר היא תסמין שכיח לגמרי. גלי את הסיבות ואיך להחזיר את הקשר עם הגוף ועם עצמך.',
  openGraph: {
    title: 'ירידה בחשק המיני בגיל המעבר — זה נורמלי ויש פתרון',
    description: 'ירידה בחשק מיני בגיל המעבר היא תסמין שכיח לגמרי. גלי את הסיבות ואיך להחזיר את הקשר עם הגוף ועם עצמך.',
  },
}

export default function Page() {
  return <ClientComponent />
}
