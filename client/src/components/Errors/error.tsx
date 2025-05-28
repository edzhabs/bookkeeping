import { AlertCircle } from "lucide-react";

export function ErrorComponent({ message }: { message?: string }) {
  return (
    <div className="flex w-full items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-6 w-6 text-destructive" />
        <h4 className="text-base font-semibold text-destructive">
          Something went wrong
        </h4>
        <p className="text-sm text-muted-foreground max-w-sm">
          {message ||
            "We couldn’t load the data. Please try again or contact support if the issue persists."}
        </p>
      </div>
    </div>
  );
}
