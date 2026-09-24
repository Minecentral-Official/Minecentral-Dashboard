import type { CompatibilityState } from '@/features/workspaces/schemas/compatibility-types';

export const compatibilityLabels: Record<CompatibilityState, string> = {
  compatible: 'Runtime supported',
  incompatible: 'Runtime unsupported',
  unknown: 'Unknown',
  'conflicting-evidence': 'Evidence disagrees',
};
const colors: Record<CompatibilityState, string> = {
  compatible: 'border-primary/40 text-primary',
  incompatible: 'border-destructive/50 text-destructive',
  unknown: 'border-border text-muted-foreground',
  'conflicting-evidence':
    'border-amber-600/50 text-amber-600 dark:text-amber-400',
};
export default function CompatibilityStateBadge({
  state,
}: {
  state: CompatibilityState;
}) {
  return (
    <span
      className={`inline-block rounded-md border px-2 py-1 text-xs font-medium ${colors[state]}`}
    >
      {compatibilityLabels[state]}
    </span>
  );
}
