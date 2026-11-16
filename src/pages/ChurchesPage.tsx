import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Church } from "../api/types";
import { EmptyState, ErrorMessage, Loading, PageHeader } from "../components/ui";

export function ChurchesPage() {
  const { data, error, isPending } = useQuery({ queryKey: ["churches"], queryFn: () => api<{ churches: Church[] }>("/churches") });

  return (
    <>
      <PageHeader title="Iglesias" icon="ph-church" iconClass="bg-purple-100 text-purple-700" />
      {error && <ErrorMessage error={error} />}
      {isPending ? (
        <Loading />
      ) : data && data.churches.length === 0 ? (
        <EmptyState icon="ph-church">No hay iglesias cargadas.</EmptyState>
      ) : (
        <ul className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
          {data?.churches.map((church) => (
            <li key={church.id} className="px-6 py-4 flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 shrink-0">
                <i className="ph ph-church text-sm"></i>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{church.name}</p>
                <p className="text-sm text-gray-500">{[church.address, church.phone].filter(Boolean).join(" · ")}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
