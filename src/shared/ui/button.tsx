import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-[var(--duration-fast)] outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary px-5 py-3 text-primary-foreground shadow-[var(--shadow-button)] hover:-translate-y-0.5 hover:bg-primary/90",
        outline:
          "border border-border bg-surface/50 px-5 py-3 text-foreground backdrop-blur-xl hover:-translate-y-0.5 hover:border-accent/60 hover:bg-surface",
        ghost: "px-3 py-2 text-muted-foreground hover:bg-surface hover:text-foreground",
        icon:
          "size-10 border border-border bg-surface/60 text-foreground backdrop-blur-xl hover:border-accent/60 hover:bg-surface",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-7 text-base",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
