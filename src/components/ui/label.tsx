import * as React from 'react';
import { cn } from '../../lib/utils';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'font-label-md text-[length:var(--text-label-md)] leading-[var(--text-label-md--line-height)] font-[var(--text-label-md--font-weight)] tracking-[var(--text-label-md--letter-spacing)] text-on-surface',
        className
      )}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };
