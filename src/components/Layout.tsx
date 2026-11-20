import { useState } from "react";
import { NavLink, Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Headquarter } from "../api/types";
import { useAuth } from "../auth/AuthContext";
import { roleLabels } from "../format";
import { Loading } from "./ui";

const links = [
  { to: "/guards", icon: "ph-shield", label: "Guardias" },
  { to: "/services", icon: "ph-hand-heart", label: "Servicios" },
  { to: "/health_facilities", icon: "ph-hospital", label: "Centros de salud" },
  { to: "/churches", icon: "ph-church", label: "Iglesias" },
];

function linkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-2 rounded-r-md px-3 py-2 text-sm font-medium border-l-2 ${
    isActive
      ? "bg-blue-50 text-blue-700 border-blue-600"
      : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900"
  }`;
}

function HeadquarterSwitcher() {
  const { me, switchHeadquarter } = useAuth();
  const canSwitch = me?.user.can_switch_headquarter ?? false;
  const { data } = useQuery({
    queryKey: ["headquarters"],
    queryFn: () => api<{ headquarters: Headquarter[] }>("/headquarters"),
    enabled: canSwitch,
  });
  if (!me) return null;

  return (
    <div className="mx-3 mb-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
        <i className="ph ph-map-pin"></i> Sede
      </p>
      {canSwitch && data ? (
        <select
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={me.headquarter.id}
          onChange={(event) => switchHeadquarter(Number(event.target.value))}
        >
          {data.headquarters.map((headquarter) => (
            <option key={headquarter.id} value={headquarter.id}>
              {headquarter.city}
            </option>
          ))}
        </select>
      ) : (
        <p className="mt-0.5 text-sm font-semibold text-gray-900">
          {me.headquarter.city}
        </p>
      )}
    </div>
  );
}

export function Layout() {
  const { me, signedIn, isLoading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!signedIn) return <Navigate to="/login" replace />;
  if (isLoading || !me) return <Loading />;

  return (
    <div className="flex min-h-screen">
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      <aside
        className={`${menuOpen ? "fixed inset-y-0 left-0 z-50 flex w-68 rounded-r-2xl shadow-xl" : "hidden"} md:static md:flex md:w-64 md:shadow-none md:rounded-none shrink-0 flex-col bg-white border-r border-gray-200`}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
          <img src="/icon.svg" alt="" className="w-8 h-8" />
          <span className="text-sm font-bold text-gray-900">SSN</span>
        </div>
        <nav
          className="space-y-1 py-6 flex-1 overflow-y-auto"
          onClick={() => setMenuOpen(false)}
        >
          <HeadquarterSwitcher />
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              <i className={`ph ${link.icon} text-lg`}></i>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <nav className="bg-white border-b border-gray-200">
          <div className="flex justify-between h-14 items-center px-4 sm:px-6 lg:px-8">
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <i className="ph ph-list text-xl"></i>
            </button>
            <div className="ml-auto flex items-center gap-3 text-sm min-w-0">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold shrink-0">
                {me.user.initials}
              </div>
              <div className="hidden sm:block min-w-0 leading-tight">
                <p className="font-medium text-gray-900 truncate">
                  {me.user.full_name}
                </p>
                <p className="text-xs text-gray-400">
                  {roleLabels[me.user.role]}
                </p>
              </div>
              <button
                className="cursor-pointer flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={signOut}
                title="Cerrar sesión"
              >
                <i className="ph ph-sign-out text-lg"></i>
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </nav>
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
