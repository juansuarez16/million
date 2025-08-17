import { PropertyDto } from "../model";
import Link from "next/link";

export default function PropertyCard({ p }: { p: PropertyDto }) {
  return (
    <div className="rounded-2xl bg-white shadow overflow-hidden">
      <img src={p.imageUrl} alt={p.name} className="h-48 w-full object-cover" />
      <div className="p-4 space-y-1">
        <div className="font-semibold">{p.name}</div>
        <div className="text-sm text-slate-600">{p.address}</div>
        <div className="font-bold">${p.price.toLocaleString()}</div>
        <Link href={`/properties/${p.id}`} className="text-blue-600 text-sm">View details</Link>
      </div>
    </div>
  );
}
