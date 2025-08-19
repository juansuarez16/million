"use client";
import { ChangeEvent, useMemo, useState } from "react";
import { TextInput, Button, Badge, Drawer,ButtonGroup } from "flowbite-react";
import { PropertyListFilters } from "../model";

type Props = { filters: PropertyListFilters; onChange: (patch: Partial<PropertyListFilters>) => void; };

export default function FiltersBar({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const hasFilters = useMemo(
    () => Boolean(filters.name || filters.address || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.sort),
    [filters]
  );

  const handleText = (key: "name" | "address") => (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();
    onChange({ [key]: v === "" ? undefined : v, page: 1 });
  };

  const handleNumber = (key: "minPrice" | "maxPrice") => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") onChange({ [key]: undefined, page: 1 });
    else {
      const n = Number(raw);
      onChange({ [key]: Number.isNaN(n) ? undefined : n, page: 1 });
    }
  };

  const setSort = (v: PropertyListFilters["sort"]) => onChange({ sort: v, page: 1 });
  const resetAll = () => onChange({ name: undefined, address: undefined, minPrice: undefined, maxPrice: undefined, sort: undefined, page: 1 });

  const Form = (
    <div className="grid gap-3 md:grid-cols-12">
      <div className="md:col-span-4">
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Name</label>
        <TextInput placeholder="Search by name" value={filters.name ?? ""} onChange={handleText("name")} />
      </div>
      <div className="md:col-span-4">
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Address</label>
        <TextInput placeholder="Search by address" value={filters.address ?? ""} onChange={handleText("address")} />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Min price</label>
        <TextInput type="number" inputMode="numeric" placeholder="Min" value={filters.minPrice ?? ""} onChange={handleNumber("minPrice")} />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Max price</label>
        <TextInput type="number" inputMode="numeric" placeholder="Max" value={filters.maxPrice ?? ""} onChange={handleNumber("maxPrice")} />
      </div>

      <div className="md:col-span-12 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Sort</span>
        <ButtonGroup>
          <Button color={filters.sort === undefined ? "dark" : "gray"} onClick={() => setSort(undefined)} size="xs">Default</Button>
          <Button color={filters.sort === "price" ? "dark" : "gray"} onClick={() => setSort("price")} size="xs">Price ↑</Button>
          <Button color={filters.sort === "-price" ? "dark" : "gray"} onClick={() => setSort("-price")} size="xs">Price ↓</Button>
          <Button color={filters.sort === "name" ? "dark" : "gray"} onClick={() => setSort("name")} size="xs">Name ↑</Button>
          <Button color={filters.sort === "-name" ? "dark" : "gray"} onClick={() => setSort("-name")} size="xs">Name ↓</Button>
        </ButtonGroup>

        <div className="ms-auto">
          {hasFilters && <Button color="light" size="xs" onClick={resetAll}>Reset all</Button>}
        </div>
      </div>

      {hasFilters && (
        <div className="md:col-span-12 flex flex-wrap items-center gap-2">
          {filters.name && <Chip onClear={() => onChange({ name: undefined, page: 1 })}>Name: {filters.name}</Chip>}
          {filters.address && <Chip onClear={() => onChange({ address: undefined, page: 1 })}>Address: {filters.address}</Chip>}
          {filters.minPrice !== undefined && <Chip onClear={() => onChange({ minPrice: undefined, page: 1 })}>Min: ${filters.minPrice}</Chip>}
          {filters.maxPrice !== undefined && <Chip onClear={() => onChange({ maxPrice: undefined, page: 1 })}>Max: ${filters.maxPrice}</Chip>}
          {filters.sort && <Chip onClear={() => onChange({ sort: undefined, page: 1 })}>Sort: {filters.sort}</Chip>}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop card */}
      <div className="hidden md:block rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        {Form}
      </div>

      {/* Mobile: botón que abre Drawer */}
      <div className="md:hidden">
        <Button color="dark" onClick={() => setOpen(true)} className="w-full">Filters</Button>
        <Drawer open={open} onClose={() => setOpen(false)} position="bottom" className="p-4">
          <div className="mx-auto w-full max-w-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Filters</h3>
              <Button color="light" size="sm" onClick={() => setOpen(false)}>Close</Button>
            </div>
            {Form}
          </div>
        </Drawer>
      </div>
    </>
  );
}

function Chip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <Badge color="gray" size="sm" className="rounded-full">
      <span className="me-1">{children}</span>
      <button onClick={onClear} aria-label="Remove filter" className="ms-1 rounded p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700">×</button>
    </Badge>
  );
}
