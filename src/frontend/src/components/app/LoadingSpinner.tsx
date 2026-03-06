import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export default function LoadingSpinner({
  size = "md",
  label,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
