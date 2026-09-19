"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useHasMounted } from "@/lib/use-mounted";

export function CartDrawer() {
  const router = useRouter();
  const mounted = useHasMounted();

  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const cartItems = mounted ? items : [];
  const subtotal = mounted ? getSubtotal() : 0;
  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const handleProceedToCheckout = () => {
    // 1. Close drawer
    // 2. Remove backdrop & clear open state
    closeCart();
    // 3. Navigate to /checkout
    router.push("/checkout");
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={closeCart}
      title="Your Bag"
      description={`${totalItems} ${totalItems === 1 ? "item" : "items"}`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Bag Items Container */}
        <div className="flex-1 overflow-y-auto py-2">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-900">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">
                  Your bag is empty.
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Find something you&apos;ll want to keep around.
                </p>
              </div>
              <Link
                href="/#products"
                onClick={closeCart}
                className={buttonVariants({
                  className: "mt-2 rounded-xl text-xs font-semibold px-6 py-5 cursor-pointer",
                })}
              >
                Shop now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {/* Product Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Info & Quantity controls */}
                  <div className="flex flex-1 flex-col justify-between text-xs">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          aria-label={`Remove ${product.name} from bag`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-neutral-500 font-mono mt-0.5">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(product.id)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-neutral-900 dark:text-white text-xs">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(product.id)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-neutral-900 dark:text-white">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Subtotal & Proceed to Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4 space-y-3 mt-auto">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">Subtotal</span>
              <span className="font-bold text-lg text-neutral-900 dark:text-white">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Free delivery & taxes calculated at checkout.
            </p>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className={buttonVariants({
                className: "w-full py-6 text-sm font-semibold rounded-xl gap-2 shadow-md cursor-pointer justify-center bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100",
              })}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </Sheet>
  );
}
