import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, "Please enter your full name.")
    .max(100, "Full name must not exceed 100 characters.")
    .trim(),
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Enter a valid email address.")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Phone number must be 10 digits."),
  address: z
    .string()
    .min(8, "Please enter a complete street address.")
    .max(250, "Address is too long.")
    .trim(),
  city: z
    .string()
    .min(2, "Please enter your city.")
    .max(50, "City name is too long.")
    .trim(),
  state: z
    .string()
    .min(2, "Please enter your state.")
    .max(50, "State name is too long.")
    .trim(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code."),
  paymentMethod: z.enum(["upi", "card", "cod"]),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
