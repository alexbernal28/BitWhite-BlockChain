export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-gov-ink sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-gov-ink-muted">Última actualización: {updated}</p>
      <div className="prose prose-sm mt-6 max-w-none space-y-4 text-sm leading-relaxed text-gov-ink">
        {children}
      </div>
    </div>
  );
}
