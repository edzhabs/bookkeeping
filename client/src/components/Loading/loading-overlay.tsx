import type React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import OverlayComponent from "./overlay-component";

const loadingOverlayVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity",
  {
    variants: {
      variant: {
        default: "bg-background/80",
        dark: "bg-background/90",
        light: "bg-white/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LoadingOverlayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingOverlayVariants> {
  isLoading?: boolean;
  spinnerSize?: "sm" | "default" | "lg";
  message?: string;
}

export function LoadingOverlay({
  className,
  variant,
  isLoading = true,
  ...props
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(loadingOverlayVariants({ variant }), className)}
      {...props}
      role="alert"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-2">
        <OverlayComponent />
        <p className="text-sm font-medium text-muted-foreground uppercase">
          Loading..
        </p>
      </div>
    </div>
  );
}
