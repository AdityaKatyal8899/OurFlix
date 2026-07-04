import { cn } from '@/lib/utils'

interface SectionTitleProps {
  children: React.ReactNode
  count?: number
  className?: string
}

export function SectionTitle({ children, count, className }: SectionTitleProps) {
  return (
    <div className={cn('flex items-baseline gap-3', className)}>
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {children}
      </h2>
      {typeof count === 'number' && (
        <span className="text-xs font-medium text-muted-foreground">{count}</span>
      )}
      <span className="ml-1 h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  )
}
