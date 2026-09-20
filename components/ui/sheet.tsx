"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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
            "fixed inset-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "duration-300"
          )}
        />

        {/* Sheet Panel — slides in from right */}
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-full sm:w-[440px] max-w-full",
            "flex-col border-l border-[#262626] bg-[#141414] p-6 shadow-2xl text-[#F3EFE7]",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full",
            "duration-300 ease-out"
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("[data-radix-dialog-content]")) return;
            onClose();
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#262626] shrink-0">
            <div>
              <DialogPrimitive.Title className="text-xl font-serif font-normal text-[#F3EFE7]">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="text-xs text-neutral-400 mt-0.5 font-sans uppercase font-mono tracking-wider">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              className="rounded-xl p-2 text-neutral-400 hover:bg-[#1A1A1A] hover:text-[#F3EFE7] transition-colors cursor-pointer"
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
