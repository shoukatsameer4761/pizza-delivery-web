import { AlertCircle, Inbox, Pizza } from "lucide-react";

export function PageLoading({
  label = "Preparing your workspace",
}: { label?: string } = {}) {
  return (
    <div
      className="flex min-h-64 items-center justify-center bg-background px-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-primary/10 shadow-[0_12px_30px_hsl(var(--primary)/0.14)]">
          <span className="absolute inset-0 rounded-[28px] border-2 border-primary/15" />
          <span className="absolute inset-1 rounded-[24px] border-2 border-transparent border-t-primary border-r-primary/40 animate-spin" />
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Pizza
              className="h-6 w-6 animate-[spin_2.4s_ease-in-out_infinite]"
              aria-hidden="true"
            />
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <div className="mt-2 flex justify-center gap-1" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: `${dot * 160}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function InlineLoading({ label = "Loading" }: { label?: string } = {}) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Pizza
          className="h-3.5 w-3.5 animate-[spin_2.4s_ease-in-out_infinite]"
          aria-hidden="true"
        />
      </span>
      <span>{label}</span>
      <span className="flex gap-0.5" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-1 w-1 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${dot * 160}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div
      className="h-48 animate-pulse rounded-lg border bg-surface-lowest"
      aria-label="Loading table"
    />
  );
}

export function CardSkeleton() {
  return (
    <div
      className="h-28 animate-pulse rounded-lg border bg-surface-lowest"
      aria-label="Loading card"
    />
  );
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
      <AlertCircle className="text-destructive" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function EmptyState({
  message = "Nothing to show yet.",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
      <Inbox className="text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
