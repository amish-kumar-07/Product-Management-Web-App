'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PackageSearch, LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white font-sans relative">
     
      <div className="absolute top-4 right-6 flex gap-3 items-center z-10">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition"
        >
          <Link href="/signin" className="flex items-center gap-1">
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition"
        >
          <Link href="/signup" className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Link>
        </Button>
      </div>

     
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <PackageSearch className="h-16 w-16 text-teal-400 animate-bounce" />
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Simplify Product Management
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl">
              Boost productivity, track inventory, and manage your business operations seamlessly.
            </p>
            <div className="mt-6">
              <Button
                asChild
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 border-t border-slate-800 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} Product Management Inc. · All rights reserved.
      </footer>
    </div>
  );
}
