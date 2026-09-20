import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Shield, Package, FileText, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Mivo",
  description: "Mivo Storefront Administration.",
};

export default async function AdminDashboardPage() {
  const user = await getServerSession();

  if (!user) {
    redirect("/auth/sign-in?callbackUrl=/admin");
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen flex items-center justify-center p-4">
        <div className="mx-auto max-w-md py-12 text-center space-y-4 px-6 rounded-xl border border-red-200 dark:border-red-900 bg-[#FFFFFF] dark:bg-[#1E2023] shadow-sm">
          <Shield className="h-10 w-10 text-red-600 dark:text-red-400 mx-auto" />
          <h1 className="text-2xl font-serif text-[#17181A] dark:text-[#F7F7F5]">
            Access Denied
          </h1>
          <p className="text-xs text-[#666A70] dark:text-[#9DA2A9]">
            You require the ADMIN role to access the administration dashboard.
          </p>
          <Link
            href="/account"
            className="inline-flex items-center rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#E5E6E3] transition-colors"
          >
            Return to Account
          </Link>
        </div>
      </div>
    );
  }

  let totalOrders = 0;
  let totalUsers = 0;
  let totalAuditLogs = 0;
  let recentOrders: Array<{
    id: string;
    orderRef: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    createdAt: Date;
  }> = [];

  try {
    const [ordersCount, usersCount, auditCount, orders] = await prisma.$transaction([
      prisma.order.count(),
      prisma.user.count(),
      prisma.auditLog.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderRef: true,
          customerName: true,
          customerEmail: true,
          total: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    totalOrders = ordersCount;
    totalUsers = usersCount;
    totalAuditLogs = auditCount;
    recentOrders = orders;
  } catch (err) {
    console.warn("[Admin Dashboard] DB query error:", err);
  }

  return (
    <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen py-12 pb-24 transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E6E3] dark:border-[#2D3035] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#A8B2A5]" />
              <h1 className="text-3xl font-serif text-[#17181A] dark:text-[#F7F7F5]">
                Mivo Admin Area
              </h1>
            </div>
            <p className="text-xs text-[#666A70] dark:text-[#9DA2A9] mt-1">
              Logged in as {user.name} ({user.email})
            </p>
          </div>
          <Badge variant="outline" className="w-fit bg-[#ECEDEA] dark:bg-[#24272B] border-[#E5E6E3] dark:border-[#2D3035] text-[#666A70] dark:text-[#9DA2A9] text-xs px-3 py-1 font-semibold uppercase tracking-widest">
            ADMIN AUTHORIZED
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-[#666A70] dark:text-[#9DA2A9]">
              <span className="text-[11px] font-semibold uppercase tracking-widest">Total Orders</span>
              <Package className="h-4 w-4 text-[#A8B2A5]" />
            </div>
            <p className="text-3xl font-semibold text-[#17181A] dark:text-[#F7F7F5]">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-[#666A70] dark:text-[#9DA2A9]">
              <span className="text-[11px] font-semibold uppercase tracking-widest">Registered Users</span>
              <Users className="h-4 w-4 text-[#A8B2A5]" />
            </div>
            <p className="text-3xl font-semibold text-[#17181A] dark:text-[#F7F7F5]">
              {totalUsers}
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-[#666A70] dark:text-[#9DA2A9]">
              <span className="text-[11px] font-semibold uppercase tracking-widest">Audit Log Entries</span>
              <FileText className="h-4 w-4 text-[#A8B2A5]" />
            </div>
            <p className="text-3xl font-semibold text-[#17181A] dark:text-[#F7F7F5]">
              {totalAuditLogs}
            </p>
          </div>
        </div>

        {/* Action Links & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 space-y-4 shadow-sm">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] flex items-center justify-between">
              <span>Recent Orders</span>
              <span className="text-[10px] text-[#666A70] dark:text-[#9DA2A9]">Live DB Stream</span>
            </h2>

            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-xs text-[#666A70] dark:text-[#9DA2A9] py-4 text-center">No orders in database.</p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[#17181A] dark:text-[#F7F7F5]">
                        #{order.orderRef}
                      </p>
                      <p className="text-[#666A70] dark:text-[#9DA2A9] text-[11px]">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#17181A] dark:text-[#F7F7F5]">
                        ₹{(order.total / 100).toLocaleString("en-IN")}
                      </p>
                      <Badge variant="outline" className="text-[10px] uppercase border-[#E5E6E3] dark:border-[#2D3035] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
                Admin Endpoints
              </h2>
              <p className="text-xs text-[#666A70] dark:text-[#9DA2A9]">
                Access real-time database endpoints, order management, and system security logs.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/api/admin/orders"
                target="_blank"
                className="flex w-full items-center justify-between rounded-lg border border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] p-3.5 text-xs text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#ECEDEA] transition-colors"
              >
                <span>GET /api/admin/orders</span>
                <ArrowRight className="h-4 w-4 text-[#666A70]" />
              </Link>
              <Link
                href="/api/admin/audit-logs"
                target="_blank"
                className="flex w-full items-center justify-between rounded-lg border border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] p-3.5 text-xs text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#ECEDEA] transition-colors"
              >
                <span>GET /api/admin/audit-logs</span>
                <ArrowRight className="h-4 w-4 text-[#666A70]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
