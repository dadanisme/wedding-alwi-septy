'use client';

import React, { useActionState } from 'react';
import Image from 'next/image';
import { loginAdminAction, type LoginActionResult } from '../../app/actions/auth';

const initialState: LoginActionResult = {
  success: false,
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header Kartu */}
        <div className="text-center">
          <div className="relative mx-auto h-20 w-20 drop-shadow-md">
            <Image
              src="/logo/monogram-gold.png"
              alt="Monogram Alwi & Septy"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="mt-4 font-display text-3xl font-normal tracking-wide text-gold-bright sm:text-4xl">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm tracking-widest uppercase text-label-on-dark/70">
            Alwi &amp; Septy · 10 Oktober 2026
          </p>
        </div>

        {/* Formulir Card */}
        <div className="rounded-2xl border border-gold-bright/25 bg-[#1E1815]/90 p-8 shadow-2xl backdrop-blur-md">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div
                role="alert"
                className="rounded-lg border border-rose-500/40 bg-rose-950/40 p-3.5 text-center text-sm text-rose-200"
              >
                {state.error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium tracking-wider uppercase text-label-on-dark/80"
              >
                Email Admin
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@wedding.alwi.septy"
                  disabled={isPending}
                  className="block w-full rounded-lg border border-gold-bright/30 bg-[#120D0A] px-4 py-3 text-sm text-[#F4EDE4] placeholder-[#8A7A6E] transition focus:border-gold-bright focus:outline-none focus:ring-1 focus:ring-gold-bright disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium tracking-wider uppercase text-label-on-dark/80"
              >
                Kata Sandi
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  disabled={isPending}
                  className="block w-full rounded-lg border border-gold-bright/30 bg-[#120D0A] px-4 py-3 text-sm text-[#F4EDE4] placeholder-[#8A7A6E] transition focus:border-gold-bright focus:outline-none focus:ring-1 focus:ring-gold-bright disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex w-full justify-center rounded-lg border border-gold-bright bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep py-3 text-sm font-semibold tracking-wider text-[#1A120B] uppercase shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-gold-bright focus:ring-offset-2 focus:ring-offset-[#1E1815] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-[#1A120B]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  'Masuk ke Dashboard'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-gold-bright/15 pt-5 text-center">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold-bright/80 transition hover:text-gold-bright hover:underline"
            >
              ← Buka Halaman Undangan Publik
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
