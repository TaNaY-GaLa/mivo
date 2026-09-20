"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
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
    closeCart();
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] text-[#666A70] dark:text-[#9DA2A9]">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-serif text-lg text-[#17181A] dark:text-[#F7F7F5]">
                  Your bag is empty.
                </h3>
                <p className="text-xs text-[#666A70] dark:text-[#9DA2A9] leading-relaxed font-sans">
                  Find something you&apos;ll want to keep around.
                </p>
              </div>
              <Link
                href="/#catalogue"
                onClick={closeCart}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#17181A] dark:bg-[#F7F7F5] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] transition-colors cursor-pointer"
              >
                Explore Shop
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E6E3] dark:divide-[#2D3035]">
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {/* Product Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B]">
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
                        <h4 className="font-serif text-[#17181A] dark:text-[#F7F7F5] text-base line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="text-[#666A70] dark:text-[#9DA2A9] hover:text-red-600 transition-colors p-1 cursor-pointer"
                          aria-label={`Remove ${product.name} from bag`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[#666A70] dark:text-[#9DA2A9] text-xs mt-0.5 font-medium">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#E5E6E3] dark:border-[#2D3035] rounded-md bg-[#ECEDEA] dark:bg-[#24272B]">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(product.id)}
                          className="p-1.5 text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center font-semibold text-[#17181A] dark:text-[#F7F7F5] text-xs">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(product.id)}
                          className="p-1.5 text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-semibold text-sm text-[#17181A] dark:text-[#F7F7F5]">
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
          <div className="border-t border-[#E5E6E3] dark:border-[#2D3035] pt-4 space-y-3 mt-auto">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#666A70] dark:text-[#9DA2A9] font-medium">Subtotal</span>
              <span className="font-semibold text-xl text-[#17181A] dark:text-[#F7F7F5]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-[#666A70] dark:text-[#9DA2A9]">
              Free delivery &amp; taxes included (inclusive GST).
            </p>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 text-xs font-semibold uppercase tracking-widest rounded-full gap-2 cursor-pointer inline-flex items-center justify-center bg-[#17181A] dark:bg-[#F7F7F5] text-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] transition-colors shadow-sm"
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
