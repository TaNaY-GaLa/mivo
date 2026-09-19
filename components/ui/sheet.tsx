"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Radix Dialog re-used as a Sheet (side drawer) primitive.
// Provides: portal rendering, accessible dialog semantics,
// focus trap, Escape-to-close, screen reader announce.

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Sheet({ isOpen, onClose, title, description, children }: SheetProps) {
  // Lock body scroll when the sheet is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-40 bg-black/50 backdrop-blur-xs",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "duration-200"
          )}
        />

        {/* Sheet Panel — slides in from right */}
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-full sm:w-[420px] max-w-full",
            "flex-col border-l border-neutral-200 bg-white p-6 shadow-2xl",
            "dark:border-neutral-800 dark:bg-neutral-900",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full",
            "duration-200"
          )}
          // Prevent clicks inside the panel from closing the sheet
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            // Close only when clicking the Overlay, not anything inside
            const target = e.target as HTMLElement;
            if (target.closest("[data-radix-dialog-content]")) return;
            onClose();
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80 dark:border-neutral-800 shrink-0">
            <div>
              <DialogPrimitive.Title className="text-lg font-serif font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-sans">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              aria-label="Close bag drawer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto py-4 min-h-0">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
