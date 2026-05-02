import type { Metadata } from 'next'
import ClientComponent from './anxiety-client'

export const metadata: Metadata = {
  title: 'התקפי חרדה בגיל המעבר — איך להכיר ולהתמודד',
  description: 'חרדות פתאומיות בגיל המעבר הן תסמין נפוץ ולא סימן לחולשה. גלי איך לזהות, להבין ולהתמודד עם התקפי חרדה.',
  openGraph: {
    title: 'התקפי חרדה בגיל המעבר — איך להכיר ולהתמודד',
    description: 'חרדות פתאומיות בגיל המעבר הן תסמין נפוץ ולא סימן לחולשה. גלי איך לזהות, להבין ולהתמודד עם התקפי חרדה.',
  },
}

export default function Page() {
  return <ClientComponent />
}
