"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await signUp.email({
        name,
        email,
        password,
      });

      if (res.error) {
        const msg = res.error.message || "Failed to create account.";
        setErrorMsg(msg);
        toast.error("Sign Up Failed", { description: msg });
      } else {
        toast.success("Account Created!", {
          description: "Welcome to Mivo. You can now access your account.",
        });
        router.push("/account");
        router.refresh();
      }
    } catch {
      const fallback = "An error occurred during account creation.";
      setErrorMsg(fallback);
      toast.error("Sign Up Error", { description: fallback });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-20 sm:px-6 text-[#17181A] dark:text-[#F7F7F5]">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif text-[#17181A] dark:text-[#F7F7F5]">
          Create a Mivo Account
        </h1>
        <p className="text-xs text-[#666A70] dark:text-[#9DA2A9] font-sans">
          Join Mivo for seamless checkout, order tracking, and member access.
        </p>
      </div>

      <div className="rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-8 shadow-sm space-y-6">
        {errorMsg && (
          <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-3.5 text-xs text-red-600 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Arjun Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-md border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] placeholder:text-[#666A70] focus:border-[#A8B2A5]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="arjun@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] placeholder:text-[#666A70] focus:border-[#A8B2A5]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Mobile Phone (+91)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="9823456781"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-md border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] placeholder:text-[#666A70] focus:border-[#A8B2A5]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Password (min. 8 characters) *
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-[#E5E6E3] dark:border-[#2D3035] pt-4 text-center text-xs text-[#666A70] dark:text-[#9DA2A9]">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-[#17181A] dark:text-[#F7F7F5] underline"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-[#666A70] dark:text-[#9DA2A9]">
        <ShieldCheck className="h-4 w-4 text-[#A8B2A5]" />
        <span>Encrypted session validation</span>
      </div>
    </div>
  );
}
