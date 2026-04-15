import React from 'react';
import prisma from "@/lib/prisma";
import { Header } from "@/app/components/public/Header";
import { Footer } from "@/app/components/public/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    },
    select: {
      id: true,
      name: true,
      slug: true
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-emerald-100 selection:text-emerald-900">
      {/* Dynamic Background elements for SEO pages */}
      <div className="fixed top-0 inset-x-0 w-full h-[600px] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none -z-10" />
      
      <Header categories={categories} />
      
      <main className="flex-grow pt-4">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
