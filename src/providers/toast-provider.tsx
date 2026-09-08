"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
type ToastKind = "success" | "error" | "warning" | "info";
type Toast = { id: number; kind: ToastKind; message: string };
type ToastContextValue = { toast: (message: string, kind?: ToastKind) => void };
const ToastContext = createContext<ToastContextValue | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const toast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = Date.now();
    setItems((current) => [...current, { id, kind, message }]);
    window.setTimeout(
      () => setItems((current) => current.filter((item) => item.id !== id)),
      4000,
    );
  }, []);
  const value = useMemo(() => ({ toast }), [toast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2" aria-live="polite">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-md border bg-card px-4 py-3 text-sm shadow-md"
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within ToastProvider");
  return value;
};
