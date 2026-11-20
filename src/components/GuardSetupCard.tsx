import { Link } from "react-router";
import type { GuardSetup } from "../api/types";

export function GuardSetupCard({ guardSetup }: { guardSetup: GuardSetup }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/guard_setups/${guardSetup.id}`} className="block">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
          <h2 className="text-xl font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
            # {guardSetup.day_number}
          </h2>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700">
            <i className="ph ph-shield text-lg"></i>
          </div>
        </div>

        <div className="px-5 py-3 space-y-1.5 text-sm text-gray-600">
          <p className="flex items-center gap-1.5">
            <i className="ph ph-user-circle text-red-500"></i>{" "}
            {guardSetup.vocal.full_name}
          </p>
          <p className="flex items-center gap-1.5 truncate">
            <i className="ph ph-users text-green-600"></i>{" "}
            {guardSetup.guardians
              .map((guardian) => guardian.full_name)
              .join(", ")}
          </p>
        </div>
      </Link>
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <Link
          className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 active:scale-95 transition-all"
          to={`/guards/new?guard_setup_id=${guardSetup.id}`}
        >
          <i className="ph ph-shield-plus"></i> Crear guardia
        </Link>{" "}
        <Link
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          to={`/guard_setups/${guardSetup.id}`}
        >
          <i className="ph ph-arrow-right"></i> Ver
        </Link>
      </div>
    </div>
  );
}
