"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 hover:shadow-glow active:scale-[0.98]",
        primary:
          "bg-primary text-white hover:bg-primary-light active:scale-[0.98]",
        secondary:
          "bg-surface-elevated text-white border border-white/[0.08] hover:bg-surface-hover hover:border-white/[0.12] active:scale-[0.98]",
        destructive:
          "bg-error text-white hover:bg-error/90 active:scale-[0.98]",
        outline:
          "border border-white/[0.08] bg-transparent text-text-secondary hover:text-white hover:bg-white/[0.05] hover:border-white/[0.12] active:scale-[0.98]",
        ghost:
          "text-text-secondary hover:text-white hover:bg-white/[0.05] active:scale-[0.98]",
        link:
          "text-primary underline-offset-4 hover:underline",
        glow:
          "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow-lg active:scale-[0.98] relative overflow-hidden",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs rounded-lg",
        lg: "h-12 px-8 text-base rounded-xl",
        xl: "h-14 px-10 text-base rounded-2xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
