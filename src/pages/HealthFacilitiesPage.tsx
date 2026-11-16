import { useDeferredValue, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { HealthFacility } from "../api/types";
import { EmptyState, ErrorMessage, Loading, PageHeader } from "../components/ui";

export function HealthFacilitiesPage() {
  const [query, setQuery] = useState("");
  // The API filters from 3 characters, like the HTML list.
  const deferred = useDeferredValue(query.trim().length >= 3 ? query.trim() : "");
  const { data, error, isPending } = useQuery({
    queryKey: ["health_facilities", deferred],
    queryFn: () => api<{ health_facilities: HealthFacility[] }>("/health_facilities", { params: { q: deferred } }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <PageHeader title="Centros de salud" icon="ph-hospital" iconClass="bg-teal-100 text-teal-700" />
      <div className="relative mb-6">
        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre (mínimo 3 letras)"
          className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {error && <ErrorMessage error={error} />}
      {isPending ? (
        <Loading />
      ) : data && data.health_facilities.length === 0 ? (
        <EmptyState icon="ph-hospital">No se encontraron centros de salud.</EmptyState>
      ) : (
        <ul className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
          {data?.health_facilities.map((facility) => (
            <li key={facility.id} className="px-6 py-4 flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 shrink-0">
                <i className="ph ph-hospital text-sm"></i>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{facility.name}</p>
                <p className="text-sm text-gray-500">{facility.address}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
