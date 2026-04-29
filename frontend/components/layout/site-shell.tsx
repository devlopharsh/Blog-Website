import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({
  children,
  title,
  description,
  action,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {(title || description || action) && (
          <section className="flex flex-col gap-5 rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[0_25px_60px_-30px_rgba(95,44,31,0.35)] sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              {title ? (
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {title}
                </h1>
              ) : null}
              {description ? (
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {description}
                </p>
              ) : null}
            </div>
            {action ? <div className="flex shrink-0">{action}</div> : null}
          </section>
        )}
        {children}
      </main>
    </div>
  );
}
