"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Loader2, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        const msg = res.error.message || "Invalid email or password.";
        setErrorMsg(msg);
        toast.error("Sign In Failed", { description: msg });
      } else {
        toast.success("Welcome back to Mivo!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      const fallback = "An unexpected error occurred during sign in.";
      setErrorMsg(fallback);
      toast.error("Sign In Error", { description: fallback });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
  };

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-16 sm:px-6 text-[#17181A] dark:text-[#F7F7F5]">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-block group">
          <span className="font-serif text-4xl text-[#17181A] dark:text-[#F7F7F5] group-hover:text-[#666A70] transition-colors">
            Mivo
          </span>
          <span className="text-xs text-[#666A70] dark:text-[#9DA2A9] font-sans tracking-wide block mt-0.5">
            Things you&apos;ll want to keep around.
          </span>
        </Link>
        <h1 className="text-2xl font-serif text-[#17181A] dark:text-[#F7F7F5] pt-2">
          Welcome back
        </h1>
        <p className="text-xs text-[#666A70] dark:text-[#9DA2A9]">
          Sign in to access your curated catalogue, bag, and order history.
        </p>
      </div>

      {/* Main Sign-In Card */}
      <div className="rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-8 shadow-sm space-y-6">
        {errorMsg && (
          <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-3.5 text-xs text-red-600 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="arjun.sharma.1@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] placeholder:text-[#666A70] focus:border-[#A8B2A5]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-md border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] placeholder:text-[#666A70] focus:border-[#A8B2A5]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#17181A] dark:bg-[#F7F7F5] text-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Helper Quick-Fill Buttons */}
        <div className="pt-4 border-t border-[#E5E6E3] dark:border-[#2D3035] space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-[#666A70] dark:text-[#9DA2A9] text-center">
            Development Quick Fill
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("arjun.sharma.1@example.com", "Member@mivo123")}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] rounded-md border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] hover:bg-[#E5E6E3] transition-colors text-[#17181A] dark:text-[#F7F7F5] cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#666A70]" />
              Member Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("admin@mivo.example.com", "Admin@mivo123")}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] rounded-md border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] hover:bg-[#E5E6E3] transition-colors text-[#17181A] dark:text-[#F7F7F5] cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#666A70]" />
              Admin Demo
            </button>
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-[#666A70] dark:text-[#9DA2A9]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-[#17181A] dark:text-[#F7F7F5] underline"
          >
            Create Account
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-[#666A70] dark:text-[#9DA2A9]">
        <ShieldCheck className="h-4 w-4 text-[#A8B2A5]" />
        <span>Encrypted Session Authorization</span>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center bg-[#F7F7F5] dark:bg-[#17181A]">
          <Loader2 className="h-6 w-6 animate-spin text-[#666A70]" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
