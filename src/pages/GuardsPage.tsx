import { Link, useSearchParams } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { GuardsPage as GuardsResponse } from "../api/types";
import { EmptyState, ErrorMessage, Loading, PageHeader, Pagination } from "../components/ui";
import { formatDate } from "../format";

export function GuardsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const { data, error, isPending } = useQuery({
    queryKey: ["guards", page],
    queryFn: () => api<GuardsResponse>("/guards", { params: { page } }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <PageHeader title="Guardias" icon="ph-shield" />
      {error && <ErrorMessage error={error} />}
      {isPending ? (
        <Loading />
      ) : data && data.guards.length === 0 ? (
        <EmptyState icon="ph-shield">Todavía no hay guardias.</EmptyState>
      ) : (
        data && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.guards.map((guard) => (
                <Link
                  key={guard.id}
                  to={`/guards/${guard.id}`}
                  className="block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className={`px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r ${guard.status === "open" ? "from-indigo-50" : "from-gray-100"} to-white`}
                  >
                    <div>
                      <p className="text-xs font-medium text-indigo-400 uppercase tracking-wide">{formatDate(guard.due_date)}</p>
                      <h2 className="text-xl font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                        # {guard.day_number}
                        {guard.status === "closed" && <i className="ph ph-lock-simple text-base text-gray-400"></i>}
                      </h2>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <i className="ph ph-hand-heart"></i> {guard.services_count} {guard.services_count === 1 ? "servicio" : "servicios"}
                    </span>
                  </div>
                  <div className="px-5 py-3 space-y-1.5 text-sm text-gray-600">
                    <p className="flex items-center gap-1.5"><i className="ph ph-user-circle text-red-500"></i> {guard.vocal.full_name}</p>
                    <p className="flex items-center gap-1.5"><i className="ph ph-cross text-purple-500"></i> {guard.priest.full_name}</p>
                    <p className="flex items-center gap-1.5 truncate">
                      <i className="ph ph-users text-green-600"></i> {guard.guardians.map((guardian) => guardian.full_name).join(", ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination page={data.page} totalPages={data.total_pages} onChange={(next) => setSearchParams({ page: String(next) })} />
          </>
        )
      )}
    </>
  );
}
