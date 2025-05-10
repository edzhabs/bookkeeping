import type React from "react";

import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

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

const spinnerVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      default: "h-8 w-8",
      sm: "h-6 w-6",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

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
  spinnerSize,
  message,
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
        <Loader2 className={cn(spinnerVariants({ size: spinnerSize }))} />
        {message && (
          <p className="text-sm font-medium text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
