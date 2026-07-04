import { cn } from '@/lib/utils'

interface BackgroundGradientProps {
  className?: string
  /** Direction of the fade. Defaults to fading from the bottom. */
  from?: 'bottom' | 'top' | 'left'
}

/**
 * Reusable cinematic gradient overlay. Sits above media and below content so
 * text always stays legible against imagery.
 */
export function BackgroundGradient({ className, from = 'bottom' }: BackgroundGradientProps) {
  const direction =
    from === 'bottom'
      ? 'bg-gradient-to-t'
      : from === 'top'
        ? 'bg-gradient-to-b'
        : 'bg-gradient-to-r'

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 from-background via-background/50 to-transparent',
        direction,
        className,
      )}
    />
  )
}
