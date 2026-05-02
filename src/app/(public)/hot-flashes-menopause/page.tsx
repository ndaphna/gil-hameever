import type { Metadata } from 'next'
import ClientComponent from './hot-flashes-client'

export const metadata: Metadata = {
  title: 'גלי חום בגיל המעבר — טיפים לשמור על הקרירות',
  description: 'גלי חום בגיל המעבר מרגישים כמו מדורה פרטית? גלי מה גורם להם ואיך להקל — טיפים מעשיים שעובדים.',
  openGraph: {
    title: 'גלי חום בגיל המעבר — טיפים לשמור על הקרירות',
    description: 'גלי חום בגיל המעבר מרגישים כמו מדורה פרטית? גלי מה גורם להם ואיך להקל — טיפים מעשיים שעובדים.',
  },
}

export default function Page() {
  return <ClientComponent />
}
