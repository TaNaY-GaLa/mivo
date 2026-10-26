"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cancelOrder } from "@/app/actions/cancel-order";

interface CancelOrderButtonProps {
  orderId: string;
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCancel = async () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setLoading(true);
    try {
      const result = await cancelOrder(orderId);
      if (result.success) {
        toast.success("Order Cancelled", { description: result.message });
        router.refresh();
      } else {
        toast.error("Could not cancel", { description: result.message });
      }
    } catch {
      toast.error("Unexpected error", { description: "Please try again." });
    } finally {
      setLoading(false);
      setConfirmed(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className={`shrink-0 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 ${
        confirmed
          ? "bg-red-600 text-white hover:bg-red-700"
          : "border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Cancelling...
        </>
      ) : confirmed ? (
        <>
          <XCircle className="w-3.5 h-3.5" /> Confirm Cancel
        </>
      ) : (
        <>
          <XCircle className="w-3.5 h-3.5" /> Cancel Order
        </>
      )}
    </button>
  );
}
