"use client";
import FiltersBar from "@/features/properties/components/FiltersBar";
import PropertyCard from "@/features/properties/components/PropertyCard";
import Pagination from "@/features/properties/components/Pagination";
import { usePropertiesVM } from "@/features/properties/usePropertiesVM";

export default function PropertiesPage() {
  const { filters, query, setFilter, paginate } = usePropertiesVM();
  const { data, isLoading, isError } = query;

  return (
    <main className="space-y-6">
      <FiltersBar filters={filters} onChange={setFilter} />

      {isLoading && <p>Loading…</p>}
      {isError && <p className="text-red-600">Error loading data.</p>}

      {data && (
        <>
          {data.items.length === 0 ? (
            <p className="text-slate-600">No results.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p) => <PropertyCard key={p.id} p={p} />)}
            </div>
          )}
          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPage={paginate} />
        </>
      )}
    </main>
  );
}
