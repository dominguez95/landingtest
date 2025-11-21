"use client";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { useOneSignal } from "@/lib/onesignal";

export default function Home() {
  useOneSignal();
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <Features />
    </main>
  );
}
