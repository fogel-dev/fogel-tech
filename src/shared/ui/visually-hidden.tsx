import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

function VisuallyHidden({
  asChild,
  className,
  ...props
}: React.ComponentProps<"span"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return <Comp className={cn("sr-only", className)} {...props} />;
}

export { VisuallyHidden };
