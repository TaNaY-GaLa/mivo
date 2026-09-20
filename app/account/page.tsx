import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Package, Shield, User as UserIcon, Calendar, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "My Account | Mivo",
  description: "Manage your Mivo profile and view order history.",
};

export default async function AccountPage() {
  const user = await getServerSession();

  if (!user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  let ordersCount = 0;
  let recentOrders: Array<{
    id: string;
    orderRef: string;
    status: string;
    total: number;
    createdAt: Date;
    items: Array<{ productName: string; quantity: number }>;
  }> = [];

  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            items: {
              select: { productName: true, quantity: true },
            },
          },
        },
      },
    });

    if (fullUser) {
      ordersCount = fullUser.orders.length;
      recentOrders = fullUser.orders;
    }
  } catch (err) {
    console.warn("[Account Page] DB query error:", err);
  }

  return (
    <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen py-12 pb-24 transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E6E3] dark:border-[#2D3035] pb-6">
          <div>
            <h1 className="text-3xl font-serif text-[#17181A] dark:text-[#F7F7F5]">
              Hello, {user.name}
            </h1>
            <p className="text-xs text-[#666A70] dark:text-[#9DA2A9] mt-1">
              Member Account • {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold border-[#E5E6E3] dark:border-[#2D3035] text-[#666A70] dark:text-[#9DA2A9] bg-[#ECEDEA] dark:bg-[#24272B]"
            >
              Role: {user.role}
            </Badge>
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full bg-[#17181A] dark:bg-[#F7F7F5] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] transition-colors"
              >
                <Shield className="h-4 w-4" />
                Admin Console
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 space-y-5 shadow-sm">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-[#A8B2A5]" />
              Profile Summary
            </h2>
            <div className="space-y-3.5 text-xs text-[#17181A] dark:text-[#F7F7F5] font-sans">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#666A70] shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#666A70] shrink-0" />
                <span>Primary Contact</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-[#666A70] shrink-0" />
                <span>Active Member Session</span>
              </div>
            </div>
          </div>

          {/* Orders Overview */}
          <div className="md:col-span-2 rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E6E3] dark:border-[#2D3035] pb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] flex items-center gap-2">
                <Package className="h-4 w-4 text-[#A8B2A5]" />
                Recent Orders ({ordersCount})
              </h2>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#666A70] dark:text-[#9DA2A9] space-y-3">
                <p>No orders placed yet.</p>
                <Link
                  href="/#catalogue"
                  className="inline-flex items-center rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#E5E6E3] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-[#17181A] dark:text-[#F7F7F5]">
                        #{order.orderRef}
                      </p>
                      <p className="text-[#666A70] dark:text-[#9DA2A9] text-[11px]">
                        {order.items.map((i) => `${i.productName} (${i.quantity})`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-[#E5E6E3] dark:border-[#2D3035] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40">
                        {order.status}
                      </Badge>
                      <p className="font-semibold text-[#17181A] dark:text-[#F7F7F5]">
                        ₹{(order.total / 100).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
