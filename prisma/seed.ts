/**
 * prisma/seed.ts
 * Mivo — Automated relational database seeder using Faker.js.
 *
 * Seeds: roles (enum values), users (admin + members), products reference,
 * orders, order items, audit logs, and email events.
 *
 * Run: npm run db:seed
 */

import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PrismaClient, Role, OrderStatus, PaymentMethod, AuditAction, EmailEventType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

// ─── Static product catalogue (mirrors lib/products.ts) ──────────────────────
// Prices in paise (INR × 100)
const CATALOGUE = [
  { id: "mivo-001", name: "Studio Wireless Headphones",    price: 1499900 },
  { id: "mivo-002", name: "Tactile Mechanical Keyboard",   price:  899900 },
  { id: "mivo-003", name: "Crafted Wool Desk Mat",         price:  249900 },
  { id: "mivo-004", name: "Solid Walnut Wireless Charger", price:  349900 },
  { id: "mivo-005", name: "Weatherproof Leather Daypack",  price:  699900 },
  { id: "mivo-006", name: "Wireless Acoustics Earbuds",    price:  549900 },
];

// ─── Deterministic helpers ────────────────────────────────────────────────────
function deterministicSeed(seed: number) {
  faker.seed(seed);
}



function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset<T>(arr: T[], min = 1, max = 3): T[] {
  const count = faker.number.int({ min, max: Math.min(max, arr.length) });
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ─── Main seed function ───────────────────────────────────────────────────────
async function main() {
  deterministicSeed(42); // reproducible data across runs

  console.log("Starting Mivo database seed...\n");

  // ── 1. Truncate existing data (in dependency order) ──────────────────────
  console.log("Clearing existing data...");
  await prisma.emailEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // ── 2. Create Admin user ──────────────────────────────────────────────────
  console.log("👑 Creating Admin user...");
  const adminPasswordHash = await hashPassword("Admin@mivo123");
  const adminUser = await prisma.user.create({
    data: {
      name: "Mivo Admin",
      email: "admin@mivo.example.com",
      emailVerified: true,
      role: Role.ADMIN,
      phone: "9876543210",
    },
  });

  await prisma.account.create({
    data: {
      userId: adminUser.id,
      accountId: adminUser.id,
      providerId: "credential",
      password: adminPasswordHash,
    },
  });
  console.log(`   ✓ Admin: ${adminUser.email}`);

  // ── 3. Create Member users ────────────────────────────────────────────────
  console.log("👥 Creating Member users...");
  const memberCount = 8;
  const memberUsers = [];

  const indianNames = [
    "Arjun Sharma",     "Priya Nair",       "Rahul Gupta",
    "Sneha Kulkarni",   "Vivek Iyer",       "Anjali Mehta",
    "Karan Bose",       "Divya Pillai",
  ];
  const indianPhones = [
    "9823456781", "8765432109", "7654321098", "9912345678",
    "8812345678", "9087654321", "7098765432", "9234567890",
  ];

  const defaultMemberPasswordHash = await hashPassword("Member@mivo123");

  for (let i = 0; i < memberCount; i++) {
    const name = indianNames[i];
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}.${i + 1}@example.com`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        emailVerified: faker.datatype.boolean({ probability: 0.75 }),
        role: Role.MEMBER,
        phone: indianPhones[i],
      },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: defaultMemberPasswordHash,
      },
    });

    memberUsers.push(user);
    console.log(`   ✓ Member: ${user.email}`);
  }

  const allUsers = [adminUser, ...memberUsers];

  // ── 4. Create Orders with OrderItems ─────────────────────────────────────
  console.log("\n🛒 Creating Orders and OrderItems...");

  const indianCities = [
    { city: "Mumbai",    state: "Maharashtra", pincode: "400001" },
    { city: "Bengaluru", state: "Karnataka",   pincode: "560001" },
    { city: "Chennai",   state: "Tamil Nadu",  pincode: "600001" },
    { city: "Pune",      state: "Maharashtra", pincode: "411001" },
    { city: "Hyderabad", state: "Telangana",   pincode: "500001" },
    { city: "Kolkata",   state: "West Bengal", pincode: "700001" },
    { city: "Ahmedabad", state: "Gujarat",     pincode: "380001" },
    { city: "Jaipur",    state: "Rajasthan",   pincode: "302001" },
  ];

  const paymentMethods = [PaymentMethod.UPI, PaymentMethod.CARD, PaymentMethod.COD];
  const orderStatuses = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.DELIVERED, // weight delivered higher
    OrderStatus.DELIVERED,
  ];

  const orderCount = 20;
  const createdOrders = [];

  for (let i = 0; i < orderCount; i++) {
    // Assign to a random member (admin can order too)
    const user = pick(memberUsers);
    const location = pick(indianCities);
    const selectedProducts = randomSubset(CATALOGUE, 1, 3);
    const paymentMethod = pick(paymentMethods);
    const status = pick(orderStatuses);

    // Build items with quantities
    const items = selectedProducts.map((p) => ({
      productId: p.id,
      productName: p.name,
      unitPrice: p.price,
      quantity: faker.number.int({ min: 1, max: 3 }),
    }));

    const subtotal = items.reduce((s, item) => s + item.unitPrice * item.quantity, 0);
    const total = subtotal; // free delivery, inclusive GST

    const orderRef = `MIVO-${faker.number.int({ min: 10000, max: 99999 })}`;

    const order = await prisma.order.create({
      data: {
        orderRef,
        status,
        paymentMethod,
        subtotal,
        total,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone ?? "9000000000",
        address: faker.location.streetAddress(),
        city: location.city,
        state: location.state,
        pincode: location.pincode,
        userId: user.id,
        createdAt: faker.date.between({
          from: new Date("2025-01-01"),
          to: new Date(),
        }),
        items: {
          create: items,
        },
      },
      include: { items: true },
    });

    createdOrders.push(order);
  }

  console.log(`   ✓ Created ${createdOrders.length} orders`);

  // ── 5. Create AuditLogs ───────────────────────────────────────────────────
  console.log("\n📋 Creating AuditLogs...");

  const auditEntries = [];

  // Registration events for all users
  for (const user of allUsers) {
    auditEntries.push({
      action: AuditAction.USER_REGISTERED,
      userId: user.id,
      metadata: { email: user.email, role: user.role },
      ipAddress: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
      createdAt: user.createdAt,
    });
  }

  // Sign-in events
  for (const user of memberUsers.slice(0, 5)) {
    for (let j = 0; j < faker.number.int({ min: 1, max: 4 }); j++) {
      auditEntries.push({
        action: AuditAction.USER_SIGNED_IN,
        userId: user.id,
        metadata: { email: user.email },
        ipAddress: faker.internet.ipv4(),
        userAgent: faker.internet.userAgent(),
        createdAt: faker.date.recent({ days: 30 }),
      });
    }
  }

  // Order creation events
  for (const order of createdOrders) {
    auditEntries.push({
      action: AuditAction.ORDER_CREATED,
      userId: order.userId,
      orderId: order.id,
      metadata: {
        orderRef: order.orderRef,
        total: order.total,
        paymentMethod: order.paymentMethod,
        itemCount: order.items.length,
      },
      createdAt: order.createdAt,
    });
  }

  // Admin viewing audit logs event
  auditEntries.push({
    action: AuditAction.ADMIN_AUDIT_VIEWED,
    userId: adminUser.id,
    metadata: { note: "Initial seed audit log" },
    createdAt: new Date(),
  });

  await prisma.auditLog.createMany({ data: auditEntries });
  console.log(`   ✓ Created ${auditEntries.length} audit log entries`);

  // ── 6. Create EmailEvents ──────────────────────────────────────────────────
  console.log("\n📧 Creating EmailEvents...");

  const emailEventTypes = [
    EmailEventType.SENT,
    EmailEventType.DELIVERED,
    EmailEventType.DELIVERED,
    EmailEventType.BOUNCED,
    EmailEventType.OPENED,
  ];

  const emailEvents = [];

  for (const order of createdOrders.slice(0, 15)) {
    const type = pick(emailEventTypes);
    emailEvents.push({
      resendId: `evt_${faker.string.alphanumeric(20)}`,
      type,
      recipient: order.customerEmail,
      subject: `Your Mivo order #${order.orderRef} is confirmed`,
      orderId: order.id,
      userId: order.userId,
      metadata: {
        orderRef: order.orderRef,
        attemptedAt: order.createdAt.toISOString(),
      },
      createdAt: new Date(order.createdAt.getTime() + 30000), // 30s after order
    });
  }

  await prisma.emailEvent.createMany({ data: emailEvents });
  console.log(`   ✓ Created ${emailEvents.length} email events`);

  // ── 7. Summary ────────────────────────────────────────────────────────────
  console.log("\n✅ Mivo database seed complete!\n");
  console.log("📊 Summary:");
  console.log(`   Users:        ${allUsers.length} (1 admin, ${memberUsers.length} members)`);
  console.log(`   Orders:       ${createdOrders.length}`);
  console.log(`   Order Items:  ${createdOrders.reduce((s, o) => s + o.items.length, 0)}`);
  console.log(`   Audit Logs:   ${auditEntries.length}`);
  console.log(`   Email Events: ${emailEvents.length}`);
  console.log("\n🔑 Test credentials:");
  console.log("   Admin   — admin@mivo.example.com  / Admin@mivo123");
  console.log("   Member  — arjun.sharma.1@example.com / Member@mivo123");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
