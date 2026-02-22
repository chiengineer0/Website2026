import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-electric)] disabled:pointer-events-none disabled:opacity-50 min-h-12 px-6',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-amber)] text-black hover:brightness-110 glow-hover',
        ghost: 'border border-white/40 bg-transparent text-white hover:border-[var(--color-electric)] hover:text-[var(--color-electric)] glow-hover',
        danger: 'bg-[var(--color-emergency)] text-white hover:brightness-110',
      },
      size: {
        default: 'h-12',
        sm: 'h-10 px-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
