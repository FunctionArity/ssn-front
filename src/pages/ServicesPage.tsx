import { useState } from "react";
import { useSearchParams } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { ServicesSearch, ServicesToday } from "../api/types";
import { ServiceCard } from "../components/ServiceCard";
import {
  EmptyState,
  ErrorMessage,
  Loading,
  PageHeader,
  Pagination,
} from "../components/ui";
import { formatDate } from "../format";

const FILTERS = [
  {
    name: "full_name",
    label: "Nombre",
    type: "text",
    placeholder: "Nombre del enfermo",
  },
  {
    name: "health_facility",
    label: "Centro de salud",
    type: "text",
    placeholder: "Hospital, clínica…",
  },
  {
    name: "caller_phone",
    label: "Teléfono",
    type: "text",
    placeholder: "Teléfono de quien llamó",
  },
  { name: "date", label: "Fecha", type: "date", placeholder: "" },
  {
    name: "guard_day",
    label: "Día de guardia",
    type: "number",
    placeholder: "1 a 31",
  },
] as const;

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

function SearchForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searching = FILTERS.some((filter) => searchParams.get(filter.name));

  return (
    <form
      key={searchParams.toString()}
      className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm p-5"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const next = new URLSearchParams();
        for (const filter of FILTERS) {
          const value = String(form.get(filter.name) ?? "").trim();
          if (value) next.set(filter.name, value);
        }
        setSearchParams(next);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {FILTERS.map((filter) => (
          <div key={filter.name}>
            <label
              htmlFor={filter.name}
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              {filter.label}
            </label>
            <input
              id={filter.name}
              name={filter.name}
              type={filter.type}
              placeholder={filter.placeholder}
              defaultValue={searchParams.get(filter.name) ?? ""}
              className={inputClass}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-3">
        {searching && (
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900"
            onClick={() => setSearchParams({})}
          >
            Limpiar
          </button>
        )}
        <button
          type="submit"
          className="cursor-pointer flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          <i className="ph ph-magnifying-glass"></i> Buscar
        </button>
      </div>
    </form>
  );
}

function SearchResults({ params }: { params: Record<string, string> }) {
  const [, setSearchParams] = useSearchParams();
  const { data, error, isPending } = useQuery({
    queryKey: ["services", "search", params],
    queryFn: () => api<ServicesSearch>("/services", { params }),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  return (
    <>
      <p className="mb-4 text-sm text-gray-500">
        {data.results_count}{" "}
        {data.results_count === 1 ? "resultado" : "resultados"}
      </p>
      {data.results.length === 0 ? (
        <EmptyState icon="ph-magnifying-glass">
          No se encontraron servicios.
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.results.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
      <Pagination
        page={data.page}
        totalPages={data.total_pages}
        onChange={(page) => setSearchParams({ ...params, page: String(page) })}
      />
    </>
  );
}

function Today() {
  const { data, error, isPending } = useQuery({
    queryKey: ["services", "today"],
    queryFn: () => api<ServicesToday>("/services"),
  });

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  return (
    <>
      <section className="mb-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <i className="ph ph-shield-check text-green-600"></i>
          {data.current_guard
            ? `Guardia de hoy · ${formatDate(data.current_guard.due_date)}`
            : "Guardia de hoy"}
        </h2>
        {!data.current_guard ? (
          <EmptyState icon="ph-shield">
            No hay una guardia abierta hoy.
          </EmptyState>
        ) : data.services.length === 0 ? (
          <EmptyState icon="ph-hand-heart">
            La guardia de hoy todavía no tiene servicios.
          </EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {data.pending_other_services.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <i className="ph ph-clock text-amber-500"></i> Pendientes de otras
            guardias ({data.pending_other_services.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.pending_other_services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                guardDueDate={service.guard_due_date}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export function ServicesPage() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(
    [...searchParams].filter(([, value]) => value),
  );
  const searching = FILTERS.some((filter) => params[filter.name]);
  const [showSearchForm, setShowSearchForm] = useState(false);

  return (
    <>
      <PageHeader title="Servicios" icon="ph-hand-heart">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-services-search-target="toggle"
            data-action="services-search#toggleFilters"
            data-show-label="Mostrar filtros"
            data-hide-label="Ocultar filtros"
            aria-expanded="false"
            aria-label="Mostrar filtros"
            title="Mostrar filtros"
            className="group cursor-pointer flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            onClick={(_) => setShowSearchForm(!showSearchForm)}
          >
            <i className="ph ph-funnel text-lg group-aria-expanded:hidden"></i>
            <i className="ph ph-funnel-x text-lg hidden group-aria-expanded:inline"></i>
          </button>
          <a
            className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            href="/services/new"
          >
            <i className="ph ph-plus text-base"></i>
            <span className="hidden sm:inline">Nuevo servicio</span>
          </a>
        </div>
      </PageHeader>
      {showSearchForm && <SearchForm />}
      {searching ? <SearchResults params={params} /> : <Today />}
    </>
  );
}
