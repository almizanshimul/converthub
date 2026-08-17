interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ faq, title }: { faq: FaqItem[]; title: string }) {
  if (!faq.length) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <dl className="mt-4 space-y-4">
        {faq.map((item) => (
          <div key={item.question} className="rounded-lg border border-border bg-card p-4">
            <dt className="font-medium">{item.question}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
