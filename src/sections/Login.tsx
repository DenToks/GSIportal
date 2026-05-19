import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { User } from "@/types";
import { users } from "@/data/sampleData";

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    const matched = email
      ? (users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? users[0])
      : users[0];
    onLogin(matched);
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel — dark navy + hero image ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden bg-[#0f172a]">
        <img
          src="/hero.jpg"
          alt="Site background"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-[#0f172a]/75" />

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="GSI Logo" width={40} height={40} className="object-contain" />
            <div>
              <p className="font-bold text-white text-lg leading-none">GSI Portal</p>
              <p className="text-slate-400 text-xs mt-0.5">Geoinnovative Inc.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Precision Geotechnical &<br />Geoscience Solutions
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Trusted engineering consultancy firm providing geotechnical, geohazard, and environmental services across the Philippines.
          </p>
        </div>

        <div className="relative z-10 p-10">
          <p className="text-slate-600 text-xs">
            © 2024 Geoinnovative Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Panel — login form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/logo.png" alt="GSI Logo" width={36} height={36} className="object-contain" />
            <div>
              <p className="font-bold text-slate-800 text-base leading-none">GSI Portal</p>
              <p className="text-slate-400 text-xs mt-0.5">Geoinnovative Inc.</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@geoinnovative.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 border-slate-200 focus:border-blue-500 h-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 border-slate-200 focus:border-blue-500 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-slate-600">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 text-sm tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Don't have an account?{" "}
            <span className="text-slate-500 font-medium">Contact your administrator</span>
          </p>
        </div>
      </div>

    </div>
  );
}
