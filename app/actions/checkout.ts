"use server";

import { checkoutSchema, CheckoutFormData } from "@/lib/schemas/checkout";
import { getProducts } from "@/lib/products";

export interface OrderResult {
  success: boolean;
  orderId?: string;
  errors?: Record<string, string[]>;
  message?: string;
  orderData?: {
    orderId: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: string;
    subtotal: number;
    total: number;
    itemsCount: number;
    createdAt: string;
  };
}

export async function processCheckoutOrder(
  formData: CheckoutFormData,
  cartItemsPayload: Array<{ id: string; quantity: number }>
): Promise<OrderResult> {
  // 1. Server-side Zod validation of customer form data
  const validationResult = checkoutSchema.safeParse(formData);
  if (!validationResult.success) {
    const formattedErrors = validationResult.error.flatten().fieldErrors as Record<
      string,
      string[]
    >;
    return {
      success: false,
      errors: formattedErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }

  // 2. Server validates cart payload — never trusts client-submitted prices
  if (!cartItemsPayload || cartItemsPayload.length === 0) {
    return {
      success: false,
      message: "Your bag is empty. Please add products before checking out.",
    };
  }

  const allProducts = getProducts();
  let subtotal = 0;
  let totalItemsCount = 0;

  for (const item of cartItemsPayload) {
    // 2a. Validate quantity is a positive integer
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return {
        success: false,
        message: "Invalid quantity detected. Please review your bag.",
      };
    }

    // 2b. Verify product exists on the server — reject invalid IDs outright
    const product = allProducts.find((p) => p.id === item.id);
    if (!product) {
      return {
        success: false,
        message: `Product with ID "${item.id}" was not found. Please refresh and try again.`,
      };
    }

    // 2c. Use server-side price — never the client-submitted price
    subtotal += product.price * item.quantity;
    totalItemsCount += item.quantity;
  }

  // 3. Generate MIVO Order ID
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderId = `MIVO-${randomSuffix}`;

  const validData = validationResult.data;

  // 4. Return structured confirmation (no sensitive server info exposed)
  return {
    success: true,
    orderId,
    orderData: {
      orderId,
      customerName: validData.fullName,
      email: validData.email,
      phone: validData.phone,
      address: validData.address,
      city: validData.city,
      state: validData.state,
      pincode: validData.pincode,
      paymentMethod: validData.paymentMethod,
      subtotal,
      total: subtotal, // Free delivery — taxes included in prices (inclusive GST)
      itemsCount: totalItemsCount,
      createdAt: new Date().toISOString(),
    },
  };
}
