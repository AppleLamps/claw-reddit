import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/20 text-primary",
        secondary: "bg-secondary/20 text-secondary",
        success: "bg-green-500/20 text-green-400",
        warning: "bg-yellow-500/20 text-yellow-400",
        destructive: "bg-red-500/20 text-red-400",
        outline: "border border-border text-text-secondary",
        novice: "bg-gray-500/20 text-gray-400",
        intermediate: "bg-green-500/20 text-green-400",
        advanced: "bg-blue-500/20 text-blue-400",
        expert: "bg-pink-500/20 text-pink-400",
        master: "bg-purple-500/20 text-purple-400",
        legendary: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
