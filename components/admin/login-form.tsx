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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#F9F5EE]">
      <div className="w-full max-w-md space-y-8">
        {/* Header Kartu */}
        <div className="text-center">
          <div className="relative mx-auto h-24 w-24 drop-shadow-sm">
            <Image
              src="/logo/monogram-gold.png"
              alt="Monogram Alwi & Septy"
              fill
              sizes="96px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="mt-4 font-display text-4xl font-normal tracking-wide text-ink sm:text-5xl">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium tracking-widest uppercase text-ink-soft">
            Alwi &amp; Septy · 10 Oktober 2026
          </p>
        </div>

        {/* Formulir Card */}
        <div className="rounded-2xl border border-[#E3D4C1] bg-white p-8 sm:p-10 shadow-xl">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-center text-sm sm:text-base font-medium text-rose-800"
              >
                {state.error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-semibold tracking-wider uppercase text-ink"
              >
                Email Admin
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@wedding.alwi.septy"
                  disabled={isPending}
                  className="block w-full rounded-xl border border-[#D4C3AC] bg-[#FDFBF7] px-4 py-3.5 text-base text-ink placeholder-[#9C8B7B] transition focus:border-gold-deep focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-deep/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm sm:text-base font-semibold tracking-wider uppercase text-ink"
              >
                Kata Sandi
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  disabled={isPending}
                  className="block w-full rounded-xl border border-[#D4C3AC] bg-[#FDFBF7] px-4 py-3.5 text-base text-ink placeholder-[#9C8B7B] transition focus:border-gold-deep focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-deep/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex w-full cursor-pointer justify-center rounded-xl bg-gold-deep py-3.5 text-base font-semibold tracking-wider text-white uppercase shadow-md transition hover:bg-[#72571B] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-deep focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin text-white"
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

          <div className="mt-8 border-t border-[#EAE0D3] pt-6 text-center">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block cursor-pointer text-sm sm:text-base font-medium text-gold-deep transition hover:text-[#644D18] hover:underline"
            >
              ← Buka Halaman Undangan Publik
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
