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
import { Button } from "@/components/ui/button";
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

  // Use isolated buyNowItems when in Buy Now flow, otherwise the persistent bag
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
      // Send only IDs + quantities — server recalculates prices
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
          // Clear only the Buy Now selection; leave persistent bag intact
          clearBuyNow();
        } else {
          // Clear the full persistent bag
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Buy Now Flow Banner */}
      {isBuyNow && buyNowItems.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p>
            <span className="font-semibold">Quick Checkout:</span> Checking out{" "}
            <span className="font-semibold">{buyNowItems[0]?.product.name}</span> directly.
            Your bag items remain saved.
          </p>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <p>{serverError}</p>
        </div>
      )}

      {/* 1. Contact Information */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          1. Contact Information
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs font-medium">Full Name</Label>
          <Input
            id="fullName"
            placeholder="e.g. Tanay Sharma"
            className="rounded-xl"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-xs text-red-600 dark:text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="tanay@example.com"
              className="rounded-xl"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-medium">Mobile Phone (+91)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="9876543210"
              className="rounded-xl"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              {...register("phone")}
            />
            {errors.phone && (
              <p id="phone-error" className="text-xs text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Delivery Address */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          2. Delivery Address
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="address" className="text-xs font-medium">Street Address</Label>
          <Input
            id="address"
            placeholder="Flat No, Building, Street, Landmark"
            className="rounded-xl"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
            {...register("address")}
          />
          {errors.address && (
            <p id="address-error" className="text-xs text-red-600 dark:text-red-400">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-xs font-medium">City</Label>
            <Input
              id="city"
              placeholder="Mumbai"
              className="rounded-xl"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
              {...register("city")}
            />
            {errors.city && (
              <p id="city-error" className="text-xs text-red-600 dark:text-red-400">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="state" className="text-xs font-medium">State</Label>
            <Input
              id="state"
              placeholder="Maharashtra"
              className="rounded-xl"
              aria-invalid={!!errors.state}
              aria-describedby={errors.state ? "state-error" : undefined}
              {...register("state")}
            />
            {errors.state && (
              <p id="state-error" className="text-xs text-red-600 dark:text-red-400">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pincode" className="text-xs font-medium">6-digit PIN Code</Label>
            <Input
              id="pincode"
              placeholder="400001"
              className="rounded-xl"
              aria-invalid={!!errors.pincode}
              aria-describedby={errors.pincode ? "pincode-error" : undefined}
              {...register("pincode")}
            />
            {errors.pincode && (
              <p id="pincode-error" className="text-xs text-red-600 dark:text-red-400">
                {errors.pincode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Payment Method */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          3. Payment Method
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* UPI */}
          <div
            role="radio"
            aria-checked={selectedPayment === "upi"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setValue("paymentMethod", "upi")}
            onClick={() => setValue("paymentMethod", "upi")}
            className={`cursor-pointer flex flex-col justify-between p-4 rounded-2xl border transition-all ${
              selectedPayment === "upi"
                ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900 ring-1 ring-neutral-900 dark:ring-white"
                : "border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <QrCode className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              {selectedPayment === "upi" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="mt-3">
              <p className="font-semibold text-xs text-neutral-900 dark:text-white">UPI / QR</p>
              <p className="text-[10px] text-neutral-500">GPay, PhonePe, Paytm</p>
            </div>
          </div>

          {/* Card */}
          <div
            role="radio"
            aria-checked={selectedPayment === "card"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setValue("paymentMethod", "card")}
            onClick={() => setValue("paymentMethod", "card")}
            className={`cursor-pointer flex flex-col justify-between p-4 rounded-2xl border transition-all ${
              selectedPayment === "card"
                ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900 ring-1 ring-neutral-900 dark:ring-white"
                : "border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <CreditCard className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              {selectedPayment === "card" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="mt-3">
              <p className="font-semibold text-xs text-neutral-900 dark:text-white">Card Payment</p>
              <p className="text-[10px] text-neutral-500">Visa, Mastercard, RuPay</p>
            </div>
          </div>

          {/* COD */}
          <div
            role="radio"
            aria-checked={selectedPayment === "cod"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setValue("paymentMethod", "cod")}
            onClick={() => setValue("paymentMethod", "cod")}
            className={`cursor-pointer flex flex-col justify-between p-4 rounded-2xl border transition-all ${
              selectedPayment === "cod"
                ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900 ring-1 ring-neutral-900 dark:ring-white"
                : "border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <Banknote className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              {selectedPayment === "cod" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="mt-3">
              <p className="font-semibold text-xs text-neutral-900 dark:text-white">Cash on Delivery</p>
              <p className="text-[10px] text-neutral-500">Pay at your doorstep</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || activeItems.length === 0}
        size="lg"
        className="w-full py-6 text-sm font-semibold rounded-xl gap-2 cursor-pointer shadow-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
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
      </Button>
    </form>
  );
}
