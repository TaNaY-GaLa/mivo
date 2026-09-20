/**
 * lib/email.ts — Resend transactional email integration
 *
 * Safe behaviour:
 * - When RESEND_API_KEY is empty, emails are logged to console only.
 * - Database mutations are never blocked on email delivery.
 * - Email is dispatched AFTER a successful database transaction.
 */

import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? "Mivo Orders <orders@mivo.example.com>";

// Resend client — created lazily so missing API key doesn't crash the app at import
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resendApiKey || resendApiKey.trim() === "") {
    return null;
  }
  if (!resend) {
    resend = new Resend(resendApiKey);
  }
  return resend;
}

export interface SendOrderConfirmationParams {
  to: string;
  customerName: string;
  orderRef: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number; // in paise
  }[];
  subtotal: number; // in paise
  total: number;    // in paise
  paymentMethod: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export async function sendOrderConfirmationEmail(
  params: SendOrderConfirmationParams
): Promise<{ id?: string; error?: string }> {
  const client = getResendClient();

  if (!client) {
    // Development fallback — log email content to console
    console.info(
      "[Email] RESEND_API_KEY not configured. Order confirmation would be sent to:",
      params.to,
      "| Order:", params.orderRef
    );
    return { id: "dev-no-send" };
  }

  try {
    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: [params.to],
      subject: `Your Mivo order ${params.orderRef} is confirmed`,
      react: OrderConfirmationEmail(params),
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return { error: error.message };
    }

    return { id: data?.id };
  } catch (err) {
    console.error("[Email] Unexpected error:", err);
    return { error: "Email delivery failed" };
  }
}
