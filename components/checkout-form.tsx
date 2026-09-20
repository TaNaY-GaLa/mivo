"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  ArrowRight,
  AlertCircle,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { checkoutSchema, CheckoutFormData } from "@/lib/schemas/checkout";
import { processCheckoutOrder } from "@/app/actions/checkout";
import { useCartStore } from "@/store/cart-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHasMounted } from "@/lib/use-mounted";

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("flow") === "buynow";

  const clearCart = useCartStore((state) => state.clearCart);
  const clearBuyNow = useCartStore((state) => state.clearBuyNow);
  const bagItems = useCartStore((state) => state.items);
  const buyNowItems = useCartStore((state) => state.buyNowItems);

  const mounted = useHasMounted();

  const activeItems = mounted
    ? isBuyNow && buyNowItems.length > 0 ? buyNowItems : bagItems
    : [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "Maharashtra",
      pincode: "",
      paymentMethod: "upi",
    },
  });

  const selectedPayment = useWatch({ control, name: "paymentMethod" });

  const onSubmit = async (data: CheckoutFormData) => {
    if (activeItems.length === 0) {
      toast.error("Your bag is empty!", {
        description: "Please add products before checking out.",
      });
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const cartItemsPayload = activeItems.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      }));

      const result = await processCheckoutOrder(data, cartItemsPayload);

      if (result.success && result.orderId) {
        toast.success("Order Placed Successfully!", {
          description: `Order ID: #${result.orderId}`,
        });

        if (isBuyNow) {
          clearBuyNow();
        } else {
          clearCart();
        }

        router.push(`/success?orderId=${encodeURIComponent(result.orderId)}`);
      } else {
        const errorMsg =
          result.message || "Failed to process order. Please check your information.";
        setServerError(errorMsg);
        toast.error("Order Failure", { description: errorMsg });
      }
    } catch {
      const fallbackMsg = "An unexpected error occurred during order submission.";
      setServerError(fallbackMsg);
      toast.error("Error", { description: fallbackMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-[#F3EFE7]">
      {/* Buy Now Flow Banner */}
      {isBuyNow && buyNowItems.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#262626] bg-[#141414] p-4 text-xs text-[#F3EFE7]">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#C5A880]" />
          <p>
            <span className="font-semibold uppercase tracking-wider text-[#C5A880]">Direct Checkout:</span> Checking out{" "}
            <span className="font-semibold">{buyNowItems[0]?.product.name}</span> directly. Your bag items remain saved.
          </p>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-xs text-red-300"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <p>{serverError}</p>
        </div>
      )}

      {/* 1. Contact Information */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-normal text-[#F3EFE7] pb-2 border-b border-[#262626]">
          1. Contact Information
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs font-mono uppercase tracking-wider text-neutral-400">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="e.g. Tanay Sharma"
            className="rounded-xl border-[#262626] bg-[#141414] text-[#F3EFE7] placeholder:text-neutral-600 focus:border-[#C5A880]"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-xs text-red-400 font-sans">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-neutral-400">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="tanay@example.com"
              className="rounded-xl border-[#262626] bg-[#141414] text-[#F3EFE7] placeholder:text-neutral-600 focus:border-[#C5A880]"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-400 font-sans">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-mono uppercase tracking-wider text-neutral-400">Mobile Phone (+91) *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="9876543210"
              className="rounded-xl border-[#262626] bg-[#141414] text-[#F3EFE7] placeholder:text-neutral-600 focus:border-[#C5A880]"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              {...register("phone")}
            />
            {errors.phone && (
              <p id="phone-error" className="text-xs text-red-400 font-sans">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Delivery Address */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-normal text-[#F3EFE7] pb-2 border-b border-[#262626]">
          2. Delivery Address
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="address" className="text-xs font-mono uppercase tracking-wider text-neutral-400">Street Address *</Label>
          <Input
            id="address"
            placeholder="Flat No, Building, Street, Landmark"
            className="rounded-xl border-[#262626] bg-[#141414] text-[#F3EFE7] placeholder:text-neutral-600 focus:border-[#C5A880]"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
            {...register("address")}
          />
          {errors.address && (
            <p id="address-error" className="text-xs text-red-400 font-sans">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-xs font-mono uppercase tracking-wider text-neutral-400">City *</Label>
            <Input
              id="city"
              placeholder="Mumbai"
              className="rounded-xl border-[#262626] bg-[#141414] text-[#F3EFE7] placeholder:text-neutral-600 focus:border-[#C5A880]"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
              {...register("city")}
            />
            {errors.city && (
              <p id="city-error" className="text-xs text-red-400 font-sans">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="state" className="text-xs font-mono uppercase tracking-wider text-neutral-400">State *</Label>
            <Input
              id="state"
              placeholder="Maharashtra"
              className="rounded-xl border-[#262626] bg-[#141414] text-[#F3EFE7] placeholder:text-neutral-600 focus:border-[#C5A880]"
              aria-invalid={!!errors.state}
              aria-describedby={errors.state ? "state-error" : undefined}
              {...register("state")}
            />
            {errors.state && (
              <p id="state-error" className="text-xs text-red-400 font-sans">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pincode" className="text-xs font-mono uppercase tracking-wider text-neutral-400">6-digit PIN *</Label>
            <Input
              id="pincode"
              placeholder="400001"
              className="rounded-xl border-[#262626] bg-[#141414] text-[#F3EFE7] placeholder:text-neutral-600 focus:border-[#C5A880]"
              aria-invalid={!!errors.pincode}
              aria-describedby={errors.pincode ? "pincode-error" : undefined}
              {...register("pincode")}
            />
            {errors.pincode && (
              <p id="pincode-error" className="text-xs text-red-400 font-sans">
                {errors.pincode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Payment Method */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-normal text-[#F3EFE7] pb-2 border-b border-[#262626]">
          3. Payment Method
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            role="radio"
            aria-checked={selectedPayment === "upi"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setValue("paymentMethod", "upi")}
            onClick={() => setValue("paymentMethod", "upi")}
            className={`cursor-pointer flex flex-col justify-between p-4 rounded-2xl border transition-all ${
              selectedPayment === "upi"
                ? "border-[#C5A880] bg-[#141414] ring-1 ring-[#C5A880]"
                : "border-[#262626] bg-[#0A0A0A] hover:border-[#C5A880]"
            }`}
          >
            <div className="flex items-center justify-between">
              <QrCode className="w-5 h-5 text-[#C5A880]" />
              {selectedPayment === "upi" && (
                <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
              )}
            </div>
            <div className="mt-3">
              <p className="font-semibold text-xs text-[#F3EFE7]">UPI / QR</p>
              <p className="text-[10px] text-neutral-500">GPay, PhonePe, Paytm</p>
            </div>
          </div>

          <div
            role="radio"
            aria-checked={selectedPayment === "card"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setValue("paymentMethod", "card")}
            onClick={() => setValue("paymentMethod", "card")}
            className={`cursor-pointer flex flex-col justify-between p-4 rounded-2xl border transition-all ${
              selectedPayment === "card"
                ? "border-[#C5A880] bg-[#141414] ring-1 ring-[#C5A880]"
                : "border-[#262626] bg-[#0A0A0A] hover:border-[#C5A880]"
            }`}
          >
            <div className="flex items-center justify-between">
              <CreditCard className="w-5 h-5 text-[#C5A880]" />
              {selectedPayment === "card" && (
                <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
              )}
            </div>
            <div className="mt-3">
              <p className="font-semibold text-xs text-[#F3EFE7]">Card Payment</p>
              <p className="text-[10px] text-neutral-500">Visa, Mastercard, RuPay</p>
            </div>
          </div>

          <div
            role="radio"
            aria-checked={selectedPayment === "cod"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setValue("paymentMethod", "cod")}
            onClick={() => setValue("paymentMethod", "cod")}
            className={`cursor-pointer flex flex-col justify-between p-4 rounded-2xl border transition-all ${
              selectedPayment === "cod"
                ? "border-[#C5A880] bg-[#141414] ring-1 ring-[#C5A880]"
                : "border-[#262626] bg-[#0A0A0A] hover:border-[#C5A880]"
            }`}
          >
            <div className="flex items-center justify-between">
              <Banknote className="w-5 h-5 text-[#C5A880]" />
              {selectedPayment === "cod" && (
                <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
              )}
            </div>
            <div className="mt-3">
              <p className="font-semibold text-xs text-[#F3EFE7]">Cash on Delivery</p>
              <p className="text-[10px] text-neutral-500">Pay at your doorstep</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || activeItems.length === 0}
        className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-full gap-2 cursor-pointer inline-flex items-center justify-center bg-[#F3EFE7] text-[#0A0A0A] hover:bg-[#C5A880] transition-colors shadow-lg disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Placing order...
          </>
        ) : (
          <>
            Place Order
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
