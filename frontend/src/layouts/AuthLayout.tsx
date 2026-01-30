// src/layouts/AuthLayout.tsx
// src/layouts/AuthLayout.tsx
import type { ReactNode } from "react";
import logo from "../assets/logo.png"; // ← adjust path to your logo file

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AuthLayout({
  children,
  title = "Welcome Back!",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <img
          src={logo}
          alt="Super Tyres Logo"
          className="w-20 h-20 object-contain drop-shadow-md"
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-8 pt-8 pb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="px-8 pb-8">{children}</div>
      </div>
    </div>
  );
}
