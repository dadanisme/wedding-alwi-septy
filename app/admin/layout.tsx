import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Admin Panel — Wedding Alwi & Septy',
  description: 'Panel pemantauan dan pengelolaan pernikahan Alwi & Septy.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F5EE] text-[#2C1E14] font-body selection:bg-gold-deep selection:text-white antialiased">
      {children}
    </div>
  );
}
