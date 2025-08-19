import Image from "next/image";
import { fetchPropertyById } from "@/features/properties/api";
import { shimmerDataURL } from "@/shared/ui/imagePlaceholder";

export default async function PropertyDetail({ params:{id} }:{params:{id:string}}) {
  const p = await fetchPropertyById(id);
  if (!p) return <main className="p-6">Not found</main>;
  return (
    <main className="space-y-4">
      <div className="relative w-full overflow-hidden rounded-2xl">
        <Image
          src={p.imageUrl}
          alt={p.name}
          width={1280}
          height={720}
          className="h-auto w-full object-cover"
          priority
          placeholder="blur"
          blurDataURL={shimmerDataURL(32, 18)}
        />
      </div>
      <h1 className="text-2xl font-bold">{p.name}</h1>
      <div className="text-slate-600 dark:text-slate-400">{p.address}</div>
      <div className="text-xl font-bold">${p.price.toLocaleString()}</div>
    </main>
  );
}
