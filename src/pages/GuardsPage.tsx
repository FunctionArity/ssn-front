import { useSearchParams } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { GuardsPage as GuardsResponse } from "../api/types";
import { GuardCard } from "../components/GuardCard";
import {
  EmptyState,
  ErrorMessage,
  Loading,
  PageHeader,
  Pagination,
} from "../components/ui";
import { GuardSetupCard } from "../components/GuardSetupCard";

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
            <div className="flex justify-center mb-6">
              <GuardSetupCard
                guardSetup={data.today_guard_setup}
              ></GuardSetupCard>{" "}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.guards.map((guard) => (
                <GuardCard key={guard.id} guard={guard} />
              ))}
            </div>
            <Pagination
              page={data.page}
              totalPages={data.total_pages}
              onChange={(next) => setSearchParams({ page: String(next) })}
            />
          </>
        )
      )}
    </>
  );
}
