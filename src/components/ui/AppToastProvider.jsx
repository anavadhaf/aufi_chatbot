import * as Toast from "@radix-ui/react-toast";
import { useEffect, useState } from "react";
import { subscribeToToasts } from "../../utils/toast";

const toastStyles = {
  default: "border-cyan-100/20 bg-white/[0.12] text-cyan-50",
  error: "border-red-200/30 bg-red-950/70 text-red-50",
  success: "border-emerald-200/30 bg-emerald-950/70 text-emerald-50",
};

export function AppToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return subscribeToToasts((nextToast) => {
      setToast(nextToast);
      setOpen(false);

      window.setTimeout(() => {
        setOpen(true);
      }, 20);
    });
  }, []);

  return (
    <Toast.Provider swipeDirection="right" duration={4200}>
      {children}

      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className={`fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border p-4 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl ${
          toastStyles[toast?.variant] || toastStyles.default
        }`}
      >
        <Toast.Title className="text-sm font-semibold">{toast?.title}</Toast.Title>
        {toast?.description ? (
          <Toast.Description className="mt-1 text-sm opacity-80">
            {toast.description}
          </Toast.Description>
        ) : null}
      </Toast.Root>

      <Toast.Viewport className="fixed right-0 top-0 z-50 m-0 flex w-full max-w-sm list-none flex-col gap-3 p-4 outline-none" />
    </Toast.Provider>
  );
}
