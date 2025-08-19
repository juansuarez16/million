import Link from "next/link";
import { Card } from "flowbite-react";

export default function Home() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-xl">
      
      

      <div className="relative p-10 md:p-16 space-y-10">
        {/* Hero */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Find your next <span className="text-emerald-300">property</span> with Million
          </h1>
          <p className="max-w-2xl text-white/80 text-lg">
            Browse curated listings with powerful filters, instant search, and a clean interface.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 px-6 py-3 font-semibold shadow-lg transition"
            >
              Explore Properties
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-white/30 px-6 py-3 font-semibold hover:bg-white/10 transition"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/5 border-white/10">
            <div className="text-3xl font-bold">2,500+</div>
            <p className="text-sm text-white/80">Active listings</p>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <div className="text-3xl font-bold">98%</div>
            <p className="text-sm text-white/80">Buyer satisfaction</p>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <div className="text-3xl font-bold">120</div>
            <p className="text-sm text-white/80">Cities covered</p>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <div className="text-3xl font-bold">24/7</div>
            <p className="text-sm text-white/80">Support</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
