import { PropertyDto } from "../model";
import Link from "next/link";
import Image from "next/image";
import { Card } from "flowbite-react";
import { shimmerDataURL } from "@/shared/ui/imagePlaceholder";

export default function PropertyCard({ p, priority = false }: { p: PropertyDto; priority?: boolean }) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow dark:border-slate-800">
      <div className="relative h-48 w-full">
        <Image
          src={p.imageUrl}
          alt={p.name}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
          placeholder="blur"
          blurDataURL={shimmerDataURL(16, 12)}
        />
      </div>
      <h5 className="text-base font-semibold tracking-tight">{p.name}</h5>
      <p className="text-sm text-slate-600 dark:text-slate-400">{p.address}</p>
      <div className="text-lg font-bold">${p.price.toLocaleString()}</div>
      <Link href={`/properties/${p.id}`} className="text-sm text-blue-600 hover:underline">
        View details
      </Link>
    </Card>
  );
}
