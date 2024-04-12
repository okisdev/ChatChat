import * as React from 'react';

import { cn } from '@/lib/ui/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition duration-200 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-neutral-500/50 focus-visible:border-neutral-800/80 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-400 dark:bg-neutral-600/30 dark:file:border-0 dark:file:bg-transparent dark:file:text-sm dark:file:font-medium dark:placeholder:text-neutral-400 dark:file:placeholder:text-neutral-400 dark:hover:border-neutral-400/50 dark:file:hover:border-neutral-400/50 dark:focus-visible:border-neutral-400/80 dark:focus-visible:ring-offset-neutral-800 dark:file:focus-visible:border-neutral-400/80 dark:file:focus-visible:ring-offset-neutral-800 dark:disabled:cursor-not-allowed dark:disabled:opacity-50 dark:file:disabled:cursor-not-allowed dark:file:disabled:opacity-50',

                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

export { Input };
