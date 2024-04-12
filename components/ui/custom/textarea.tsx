import * as React from 'react';

import { cn } from '@/lib/ui/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-400 dark:bg-neutral-600/30',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

export { Textarea };
