/**
 * app/api/webhooks/resend/route.ts
 * Resend webhook handler — ingests email lifecycle events.
 *
 * Security:
 * - Validates Resend webhook signature using svix (Resend's verification library)
 * - Idempotent: uses resendId (message ID) as unique key — duplicate events are
 *   detected and silently acknowledged (200 OK, no duplicate DB record)
 * - Never exposes internal errors to the webhook sender
 *
 * Supported events: email.sent, email.delivered, email.bounced, email.failed
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { EmailEventType } from "@prisma/client";
import { Webhook } from "svix";

// Map Resend event types to our EmailEventType enum
const EVENT_TYPE_MAP: Record<string, EmailEventType> = {
  "email.sent":      EmailEventType.SENT,
  "email.delivered": EmailEventType.DELIVERED,
  "email.bounced":   EmailEventType.BOUNCED,
  "email.failed":    EmailEventType.FAILED,
  "email.opened":    EmailEventType.OPENED,
  "email.clicked":   EmailEventType.CLICKED,
  "email.complained":EmailEventType.COMPLAINED,
};

interface ResendWebhookPayload {
  type: string;
  data: {
    email_id: string;
    from?: string;
    to?: string[];
    subject?: string;
    created_at?: string;
    [key: string]: unknown;
  };
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Read raw body for signature verification
    const body = await request.text();

    // Validate webhook signature if secret is configured
    if (webhookSecret && webhookSecret.trim() !== "") {
      const svixId        = request.headers.get("svix-id") ?? "";
      const svixTimestamp = request.headers.get("svix-timestamp") ?? "";
      const svixSignature = request.headers.get("svix-signature") ?? "";

      if (!svixId || !svixTimestamp || !svixSignature) {
        return Response.json(
          { error: "Missing webhook signature headers." },
          { status: 400 }
        );
      }

      try {
        const wh = new Webhook(webhookSecret);
        wh.verify(body, {
          "svix-id":        svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        });
      } catch {
        console.warn("[Webhook] Invalid signature — rejected.");
        return Response.json({ error: "Invalid signature." }, { status: 401 });
      }
    } else {
      // No webhook secret configured — log warning and accept payload in fallback mode
      console.warn("[Webhook] RESEND_WEBHOOK_SECRET not configured — skipping signature verification.");
    }

    // Parse payload
    let payload: ResendWebhookPayload;
    try {
      payload = JSON.parse(body) as ResendWebhookPayload;
    } catch {
      return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const { type, data } = payload;

    // Only process known event types
    const eventType = EVENT_TYPE_MAP[type];
    if (!eventType) {
      // Acknowledge unknown events without processing
      console.info(`[Webhook] Unknown event type: ${type} — acknowledged.`);
      return Response.json({ received: true });
    }

    const resendMessageId = data.email_id;
    if (!resendMessageId) {
      return Response.json({ error: "Missing email_id in payload." }, { status: 400 });
    }

    // Idempotency check — avoid duplicate records for the same event
    const existing = await prisma.emailEvent.findUnique({
      where: { resendId: resendMessageId },
    });

    if (existing) {
      // Already processed — acknowledge without inserting duplicate
      console.info(`[Webhook] Duplicate event ${resendMessageId} — skipped.`);
      return Response.json({ received: true, duplicate: true });
    }

    const recipient = data.to?.[0] ?? "unknown";

    // Persist the email event
    await prisma.emailEvent.create({
      data: {
        resendId: resendMessageId,
        type:     eventType,
        recipient,
        subject:  typeof data.subject === "string" ? data.subject : undefined,
        metadata: {
          rawType:    type,
          from:       data.from,
          receivedAt: new Date().toISOString(),
          ...(typeof data === "object" ? data : {}),
        },
      },
    });

    // Create audit log for bounces (actionable events)
    if (eventType === EmailEventType.BOUNCED || eventType === EmailEventType.FAILED) {
      await prisma.auditLog.create({
        data: {
          action: "WEBHOOK_RECEIVED",
          metadata: {
            eventType: type,
            recipient,
            resendId: resendMessageId,
          },
        },
      });
    }

    console.info(`[Webhook] Processed ${type} for ${recipient}`);
    return Response.json({ received: true });
  } catch (err) {
    // Never expose internal errors to the webhook sender
    console.error("[Webhook] Error:", err);
    return Response.json({ received: false }, { status: 500 });
  }
}
