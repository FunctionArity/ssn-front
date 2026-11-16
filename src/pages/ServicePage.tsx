import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { ServiceDetail } from "../api/types";
import { ErrorMessage, Field, Loading, PageHeader } from "../components/ui";
import { formatDate, plainText } from "../format";

export function ServicePage() {
  const { id } = useParams();
  const { data, error, isPending } = useQuery({
    queryKey: ["services", "detail", id],
    queryFn: () => api<{ service: ServiceDetail }>(`/services/${id}`),
  });

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  const { service } = data;
  const completed = service.status === "completed";
  const note = plainText(service.note);
  const caller = [service.caller_full_name, service.caller_relationship && `(${service.caller_relationship})`].filter(Boolean).join(" ");

  return (
    <>
      <PageHeader title={service.full_name} icon="ph-hand-heart">
        <Link to={`/guards/${service.guard.id}`} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
          <i className="ph ph-shield"></i> Guardia # {service.guard.day_number}
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
          <Field label="Estado" icon={completed ? "ph-check-circle" : "ph-clock"}>
            <span className="flex items-center gap-1.5">
              <span className={completed ? "badge_green" : "badge_red"}>{completed ? "Completado" : "Pendiente"}</span>
              {service.priority === "urgent" && <span className={`badge_urgent ${completed ? "badge_urgent_completed" : ""}`}>Urgente</span>}
            </span>
          </Field>
          <Field label="Fecha" icon="ph-calendar">{formatDate(service.due_date)}</Field>
          {service.age !== null && <Field label="Edad" icon="ph-user">{service.age} años</Field>}
          {service.health_facility && (
            <Field label="Centro de salud" icon="ph-hospital">
              {service.health_facility.name}
              {service.health_facility_place && <span className="font-normal text-gray-500"> · {service.health_facility_place}</span>}
            </Field>
          )}
          {service.address && <Field label="Dirección" icon="ph-map-pin">{service.address}</Field>}
          {service.pathology && <Field label="Patología" icon="ph-first-aid">{service.pathology}</Field>}
          {service.health_status && <Field label="Estado de salud" icon="ph-heartbeat">{service.health_status}</Field>}
          {service.sacraments && <Field label="Sacramentos" icon="ph-cross">{service.sacraments}</Field>}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
            {caller && <Field label="Quién llamó" icon="ph-phone-call">{caller}</Field>}
            {service.caller_phone && (
              <Field label="Teléfono" icon="ph-phone">
                <a href={`tel:${service.caller_phone}`} className="text-blue-600 hover:underline">{service.caller_phone}</a>
              </Field>
            )}
            <Field label="Cargado por" icon="ph-user-circle">{service.created_by.full_name}</Field>
            <Field label="Comentarios" icon="ph-chat-circle">{service.comments_count}</Field>
          </div>
          {note && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Nota</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{note}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
