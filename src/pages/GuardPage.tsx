import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Guard, Service } from "../api/types";
import { ServiceCard } from "../components/ServiceCard";
import {
  EmptyState,
  ErrorMessage,
  Field,
  Loading,
  PageHeader,
} from "../components/ui";
import { formatDate, plainText } from "../format";

export function GuardPage() {
  const { id } = useParams();
  const { data, error, isPending } = useQuery({
    queryKey: ["guards", "detail", id],
    queryFn: () =>
      api<{ guard: Guard & { services: Service[] } }>(`/guards/${id}`),
  });

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  const { guard } = data;
  const notes = plainText(guard.notes);

  return (
    <>
      <PageHeader
        title={`Guardia # ${guard.day_number}`}
        icon="ph-shield"
        iconClass="bg-indigo-100 text-indigo-700"
      >
        <Link
          to="/guards"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <i className="ph ph-arrow-left"></i> Guardias
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100 self-start">
          <Field label="Fecha" icon="ph-calendar-check">
            {formatDate(guard.due_date)}
          </Field>
          <Field
            label="Estado"
            icon={
              guard.status === "open" ? "ph-shield-check" : "ph-lock-simple"
            }
          >
            {guard.status === "open" ? (
              <span className="text-green-700">Abierta</span>
            ) : (
              <span className="text-gray-500">Cerrada</span>
            )}
          </Field>
          <Field label="Número" icon="ph-hash">
            {guard.number}
          </Field>
          <Field label="Vocal" icon="ph-user-circle">
            {guard.vocal.full_name}
          </Field>
          <Field label="Sacerdote" icon="ph-cross">
            {guard.priest.full_name}
          </Field>
          <Field label="Guardianes" icon="ph-users">
            {guard.guardians.map((guardian) => (
              <p key={guardian.id}>{guardian.full_name}</p>
            ))}
          </Field>
          {notes && (
            <Field label="Notas" icon="ph-note">
              <span className="font-normal whitespace-pre-line">{notes}</span>
            </Field>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <i className="ph ph-hand-heart text-blue-600"></i> Servicios (
            {guard.services.length})
          </h2>
          {guard.services.length === 0 ? (
            <EmptyState icon="ph-hand-heart">
              Esta guardia no tiene servicios.
            </EmptyState>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {guard.services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
