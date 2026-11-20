import { Link } from "react-router";
import type { GuardListItem } from "../api/types";
import { formatDate } from "../format";

export function GuardCard({ guard }: { guard: GuardListItem }) {
  return (
    <Link
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
  );
}
