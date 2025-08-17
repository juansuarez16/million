import { fetchPropertyById } from "@/features/properties/api";

export default async function PropertyDetail({ params:{id} }:{params:{id:string}}) {
  const p = await fetchPropertyById(id);
  if (!p) return <main className="p-6">Not found</main>;
  return (
    <main className="space-y-4">
      <img src={p.imageUrl} alt={p.name} className="w-full h-80 object-cover rounded-2xl" />
      <h1 className="text-2xl font-bold">{p.name}</h1>
      <div className="text-slate-600">{p.address}</div>
      <div className="text-xl font-bold">${p.price.toLocaleString()}</div>
    </main>
  );
}
