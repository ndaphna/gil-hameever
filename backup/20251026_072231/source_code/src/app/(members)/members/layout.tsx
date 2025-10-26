export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-5xl mx-auto p-8">
      <div className="mb-6 rounded border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900">
        <h2>איזור חברות פרימיום</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          התוכן להלן זמין לחברות מועדון בלבד.
        </p>
      </div>
      {children}
    </section>
  );
}


