"use client";

import { useEffect, useState } from "react";

import type { PropertyDto } from "@/features/properties/model";
import { fetchPropertyById } from "@/features/properties/api"; // <- esta función debe forzar client o no usar SSR
import PropertyHeroImage from "./PropertyHeroImage";

type Props = { id: string };

export default function PropertyDetailClient({ id }: Props) {
  
  const [data, setData] = useState<PropertyDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const p = await fetchPropertyById(id); // se ejecuta en cliente
        if (!alive) return;
        if (!p) {
          setError("Not found");
          return;
        }
        setData(p);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <main className="p-6">Cargando…</main>;
  if (error) {
    // No podemos usar notFound() en cliente; redirige o muestra un estado 404 simple
    // router.replace("/404"); // si tienes /404
    return <main className="p-6">No se encontró la propiedad.</main>;
  }

  return (
    <main className="space-y-4 p-6">
      <div className="relative w-full overflow-hidden rounded-2xl">
        <PropertyHeroImage src={data?.imageUrl} alt={data?.name ?? "Property"} />
      </div>

      <h1 className="text-2xl font-bold">{data?.name}</h1>
      <div className="text-slate-600 dark:text-slate-400">{data?.address}</div>
      <div className="text-xl font-bold">${(data?.price ?? 0).toLocaleString()}</div>
    </main>
  );
}
