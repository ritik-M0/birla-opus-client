"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginScreenProps {
  onLogin: () => void;
}

const loginButtonStyle = `
  .login-button {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.85) 0%,
      rgba(29, 164, 98, 0.15) 40%,
      rgba(232, 84, 26, 0.12) 70%,
      rgba(123, 94, 167, 0.14) 100%
    );
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(29, 164, 98, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.4);
  }
  .login-button:hover {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.88) 0%,
      rgba(29, 164, 98, 0.2) 40%,
      rgba(232, 84, 26, 0.16) 70%,
      rgba(123, 94, 167, 0.18) 100%
    );
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 12px 36px rgba(29, 164, 98, 0.18);
  }
  .login-button:active {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phone, setPhone] = useState("");

  return (
    <div className="flex flex-col h-full bg-background px-7">
      <style>{loginButtonStyle}</style>
      {/* Top area — logo */}
      <div className="flex-1 flex flex-col items-center justify-end pb-8">
        <Image
          src="/birla-opus-logo.jpg"
          alt="Birla Opus Paints"
          width={180}
          height={180}
          className="object-contain"
          priority
        />
        <p className="text-sm text-muted-foreground mt-2 tracking-wide">
          Field Measurement App
        </p>

        {/* Thin separator */}
        <div className="w-8 h-px bg-border mt-6" />
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-start pt-8 gap-5">
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="text-xs font-semibold text-muted-foreground tracking-widest uppercase"
          >
            Mobile Number
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-14 px-4 bg-muted rounded-xl text-sm font-semibold text-foreground border border-transparent">
              +91
            </div>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="00000 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 h-14 px-4 text-base bg-muted border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-navy"
            />
          </div>
        </div>

        {/* Soft premium Login button matching greeting card aesthetic */}
        <Button
          onClick={onLogin}
          className="login-button h-14 text-base font-semibold rounded-xl text-foreground tracking-wide border-0"
        >
          Login
        </Button>
      </div>

      {/* Footer */}
      <div className="pb-6 pt-4">
        <p className="text-center text-[11px] text-muted-foreground/50 tracking-wide">
          Made with love by 1000xdevs
        </p>
      </div>
    </div>
  );
}
