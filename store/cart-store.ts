import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/lib/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

/**
 * buyNowItems: ephemeral — represents a direct "Buy Now" checkout selection.
 * It is NOT persisted to localStorage to avoid polluting the persistent bag.
 * It is cleared after the checkout succeeds/fails.
 *
 * Checkout component reads `buyNowItems` first; if non-empty, it only submits
 * those items (ignoring the persistent bag) so that Buy Now is truly isolated.
 */
type CartState = {
  // Persistent bag
  items: CartItem[];

  // Ephemeral Buy Now selection (not persisted)
  buyNowItems: CartItem[];

  // Drawer open state (not persisted)
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  addItem: (product: Product, quantity?: number) => void;

  /** Initiates Buy Now flow: sets buyNowItems without touching persistent bag */
  setBuyNow: (product: Product, quantity?: number) => void;
  /** Clears Buy Now selection after use */
  clearBuyNow: () => void;

  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      buyNowItems: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const idx = state.items.findIndex((i) => i.product.id === product.id);
          if (idx > -1) {
            const updated = state.items.map((i, index) =>
              index === idx ? { ...i, quantity: i.quantity + quantity } : i
            );
            return { items: updated };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      setBuyNow: (product: Product, quantity = 1) => {
        // Only sets the Buy Now ephemeral selection — does NOT modify bag
        set({ buyNowItems: [{ product, quantity }] });
      },

      clearBuyNow: () => set({ buyNowItems: [] }),

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      increaseQuantity: (productId: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
      },

      decreaseQuantity: (productId: string) => {
        set((state) => {
          const item = state.items.find((i) => i.product.id === productId);
          if (item && item.quantity <= 1) {
            return { items: state.items.filter((i) => i.product.id !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [], buyNowItems: [], isOpen: false }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
    }),
    {
      name: "mivo-bag-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the permanent bag items; never persist isOpen or buyNowItems
      partialize: (state) => ({ items: state.items }),
      skipHydration: false,
    }
  )
);
