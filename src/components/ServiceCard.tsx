import { Link } from "react-router";
import type { Service } from "../api/types";
import { formatDate } from "../format";

export function ServiceCard({ service, guardDueDate }: { service: Service; guardDueDate?: string }) {
  const completed = service.status === "completed";
  return (
    <Link
      to={`/services/${service.id}`}
      className={`block bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow ${completed ? "border-green-200" : "border-gray-200"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-wide">{formatDate(service.due_date, "short")}</p>
          <h3 className="text-base font-semibold text-gray-900 mt-0.5 truncate">{service.full_name}</h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {service.priority === "urgent" && (
            <span className={`badge_urgent ${completed ? "badge_urgent_completed" : ""}`}>
              <i className="ph-bold ph-warning"></i> Urgente
            </span>
          )}
          <span className={completed ? "badge_green" : "badge_red"}>{completed ? "Completado" : "Pendiente"}</span>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-sm text-gray-600">
        {service.health_facility && (
          <p className="flex items-center gap-1.5 truncate">
            <i className="ph ph-hospital text-gray-400"></i>
            {service.health_facility.name}
            {service.health_facility_place && <span className="text-gray-400">· {service.health_facility_place}</span>}
          </p>
        )}
        {service.age !== null && (
          <p className="flex items-center gap-1.5">
            <i className="ph ph-user text-gray-400"></i> {service.age} años
          </p>
        )}
        {guardDueDate && (
          <p className="flex items-center gap-1.5 text-gray-500">
            <i className="ph ph-shield text-gray-400"></i> Guardia del {formatDate(guardDueDate, "short")}
          </p>
        )}
      </div>
    </Link>
  );
}
