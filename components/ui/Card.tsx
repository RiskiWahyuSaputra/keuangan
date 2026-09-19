interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-3xl ios-glass-card transition-all ${className}`.trim()}
    >
      {children}
    </section>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/50 dark:border-white/10 px-6 py-4">
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
