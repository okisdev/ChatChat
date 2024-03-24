import * as React from 'react';

import { cn } from '@/lib/ui/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition duration-200 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-stone-500/50 focus-visible:border-stone-800/80 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

export { Input };
