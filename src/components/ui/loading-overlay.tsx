import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isOpen: boolean;
  message?: string;
}

export function LoadingOverlay({ isOpen, message = "Loading..." }: LoadingOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <div 
        className="rounded-sm border bg-card p-2 shadow-sm"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex items-center gap-4">
          {/* Spinner */}
          <div
            className="h-4 w-4 animate-spin rounded-full"
            style={{
              border: "4px solid #e5e7eb",
              borderTopColor: "#3b82f6",
            }}
          />
          <p className="text-sm font-normal">{message}</p>
        </div>
      </div>
    </div>
  );
}
