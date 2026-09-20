/**
 * emails/order-confirmation.tsx
 * Mivo Order Confirmation email template using React Email.
 * Uses inline styles for maximum email client compatibility.
 */

import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number; // in paise
}

interface OrderConfirmationEmailProps {
  to?: string;
  customerName: string;
  orderRef: string;
  items: OrderItem[];
  subtotal: number; // in paise
  total: number;    // in paise
  paymentMethod: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function formatPaymentMethod(method: string): string {
  const map: Record<string, string> = {
    UPI: "UPI / QR Code",
    CARD: "Credit / Debit Card",
    COD: "Cash on Delivery",
  };
  return map[method.toUpperCase()] ?? method;
}

export function OrderConfirmationEmail({
  customerName,
  orderRef,
  items,
  subtotal,
  total,
  paymentMethod,
  address,
  city,
  state,
  pincode,
}: OrderConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        Your Mivo order {orderRef} has been confirmed. Thank you for shopping
        with us.
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.brand}>MIVO</Text>
            <Text style={styles.tagline}>Things you&apos;ll want to keep around.</Text>
          </Section>

          {/* Main content */}
          <Section style={styles.content}>
            <Heading as="h1" style={styles.heading}>
              Order Confirmed
            </Heading>
            <Text style={styles.subheading}>
              Hi {customerName}, your order has been received and is being
              processed.
            </Text>

            {/* Order reference */}
            <Section style={styles.orderRefBox}>
              <Text style={styles.orderRefLabel}>Order Reference</Text>
              <Text style={styles.orderRefValue}>#{orderRef}</Text>
            </Section>

            <Hr style={styles.divider} />

            {/* Order items */}
            <Heading as="h2" style={styles.sectionTitle}>
              Your Items
            </Heading>
            {items.map((item, i) => (
              <Row key={i} style={styles.itemRow}>
                <Column style={styles.itemNameCol}>
                  <Text style={styles.itemName}>{item.productName}</Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={styles.itemPriceCol}>
                  <Text style={styles.itemPrice}>
                    {formatINR(item.unitPrice * item.quantity)}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={styles.divider} />

            {/* Totals */}
            <Row style={styles.totalRow}>
              <Column>
                <Text style={styles.totalLabel}>Subtotal</Text>
              </Column>
              <Column style={styles.totalAmountCol}>
                <Text style={styles.totalAmount}>{formatINR(subtotal)}</Text>
              </Column>
            </Row>
            <Row style={styles.totalRow}>
              <Column>
                <Text style={styles.totalLabel}>Delivery</Text>
              </Column>
              <Column style={styles.totalAmountCol}>
                <Text style={styles.totalAmount}>Free</Text>
              </Column>
            </Row>
            <Row style={{ ...styles.totalRow, ...styles.grandTotalRow }}>
              <Column>
                <Text style={styles.grandTotalLabel}>Total</Text>
              </Column>
              <Column style={styles.totalAmountCol}>
                <Text style={styles.grandTotalAmount}>{formatINR(total)}</Text>
              </Column>
            </Row>
            <Text style={styles.taxNote}>
              Prices include GST. {formatPaymentMethod(paymentMethod)}.
            </Text>

            <Hr style={styles.divider} />

            {/* Delivery address */}
            <Heading as="h2" style={styles.sectionTitle}>
              Delivery Address
            </Heading>
            <Text style={styles.addressText}>
              {address}
              <br />
              {city}, {state} — {pincode}
            </Text>

            <Hr style={styles.divider} />

            {/* Note */}
            <Text style={styles.note}>
              This is a demo order confirmation. Mivo is a student project for
              educational purposes.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Questions? Reply to this email or visit{" "}
              <Link href={process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"} style={styles.footerLink}>
                Mivo
              </Link>
              .
            </Text>
            <Text style={styles.footerSmall}>
              © {new Date().getFullYear()} Mivo. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#f5f5f4",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: "40px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    maxWidth: "560px",
    margin: "0 auto",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#171717",
    padding: "32px 40px 24px",
    textAlign: "center",
  },
  brand: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "8px",
    margin: "0 0 4px",
    fontFamily: "Georgia, serif",
  },
  tagline: {
    color: "#a3a3a3",
    fontSize: "11px",
    margin: 0,
    letterSpacing: "0.5px",
  },
  content: {
    padding: "32px 40px",
  },
  heading: {
    color: "#171717",
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 8px",
  },
  subheading: {
    color: "#525252",
    fontSize: "15px",
    margin: "0 0 24px",
    lineHeight: "1.5",
  },
  orderRefBox: {
    backgroundColor: "#fafafa",
    border: "1px solid #e5e5e5",
    borderRadius: "8px",
    padding: "16px 20px",
    marginBottom: "24px",
  },
  orderRefLabel: {
    color: "#737373",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    margin: "0 0 4px",
  },
  orderRefValue: {
    color: "#171717",
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "1px",
  },
  divider: {
    borderColor: "#e5e5e5",
    margin: "20px 0",
  },
  sectionTitle: {
    color: "#171717",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    margin: "0 0 12px",
  },
  itemRow: {
    marginBottom: "10px",
  },
  itemNameCol: {
    width: "75%",
  },
  itemName: {
    color: "#171717",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0 0 2px",
  },
  itemQty: {
    color: "#737373",
    fontSize: "12px",
    margin: 0,
  },
  itemPriceCol: {
    width: "25%",
    textAlign: "right" as const,
  },
  itemPrice: {
    color: "#171717",
    fontSize: "14px",
    fontWeight: "500",
    margin: 0,
  },
  totalRow: {
    marginBottom: "6px",
  },
  grandTotalRow: {
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #e5e5e5",
  },
  totalLabel: {
    color: "#525252",
    fontSize: "14px",
    margin: 0,
  },
  totalAmountCol: {
    textAlign: "right" as const,
  },
  totalAmount: {
    color: "#525252",
    fontSize: "14px",
    margin: 0,
  },
  grandTotalLabel: {
    color: "#171717",
    fontSize: "15px",
    fontWeight: "600",
    margin: 0,
  },
  grandTotalAmount: {
    color: "#171717",
    fontSize: "15px",
    fontWeight: "700",
    margin: 0,
  },
  taxNote: {
    color: "#a3a3a3",
    fontSize: "11px",
    margin: "8px 0 0",
  },
  addressText: {
    color: "#525252",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0 0 8px",
  },
  note: {
    color: "#a3a3a3",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: 0,
    fontStyle: "italic",
  },
  footer: {
    backgroundColor: "#fafafa",
    borderTop: "1px solid #e5e5e5",
    padding: "20px 40px",
    textAlign: "center" as const,
  },
  footerText: {
    color: "#737373",
    fontSize: "13px",
    margin: "0 0 4px",
  },
  footerLink: {
    color: "#171717",
    textDecoration: "underline",
  },
  footerSmall: {
    color: "#a3a3a3",
    fontSize: "11px",
    margin: 0,
  },
};

export default OrderConfirmationEmail;
