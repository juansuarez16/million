"use client";
import { PropertyListFilters } from "../model";
import { ChangeEvent } from "react";

type Props = {
  filters: PropertyListFilters;
  onChange: (patch: Partial<PropertyListFilters>) => void;
};

export default function FiltersBar({ filters, onChange }: Props) {
  // helpers
  const handleText =
    (key: "name" | "address") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.trim();
      onChange({ [key]: v === "" ? undefined : v });
    };

  const handleNumber =
    (key: "minPrice" | "maxPrice") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === "" || raw === undefined || raw === null) {
        onChange({ [key]: undefined });
      } else {
        const n = Number(raw);
        onChange({ [key]: Number.isNaN(n) ? undefined : n });
      }
    };

  const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
    // tipado correcto del union
    const v = (e.target.value || undefined) as PropertyListFilters["sort"];
    onChange({ sort: v });
  };

  return (
    <div className="grid gap-3 md:grid-cols-6 p-4 bg-white rounded-2xl shadow">
      <input
        className="md:col-span-2 input"
        placeholder="Name"
        value={filters.name ?? ""}
        onChange={handleText("name")}
      />
      <input
        className="md:col-span-2 input"
        placeholder="Address"
        value={filters.address ?? ""}
        onChange={handleText("address")}
      />
      <input
        className="input"
        type="number"
        placeholder="Min price"
        value={filters.minPrice ?? ""}
        onChange={handleNumber("minPrice")}
      />
      <input
        className="input"
        type="number"
        placeholder="Max price"
        value={filters.maxPrice ?? ""}
        onChange={handleNumber("maxPrice")}
      />
      <select
        className="md:col-span-2 input"
        value={filters.sort ?? ""}
        onChange={handleSort}
      >
        <option value="">Sort</option>
        <option value="price">Price ↑</option>
        <option value="-price">Price ↓</option>
        <option value="name">Name ↑</option>
        <option value="-name">Name ↓</option>
      </select>
    </div>
  );
}
