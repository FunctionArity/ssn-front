export type Role = "guardian" | "vocal" | "priest";
export type UserType = "regular" | "admin" | "super_admin";

export interface UserSummary {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  initials: string;
  role: Role;
}

export interface CurrentUser extends UserSummary {
  email: string;
  user_type: UserType;
  can_switch_headquarter: boolean;
}

export interface Headquarter {
  id: number;
  slug: string;
  city: string;
  state: string;
  country: string;
}

export interface Me {
  user: CurrentUser;
  headquarter: Headquarter;
}

export interface SignInResponse extends Me {
  token: string;
}

export interface GuardSetup {
  id: number;
  number: number;
  day_number: number;  
  notes: string | null;
  vocal: UserSummary;  
  guardians: UserSummary[];
}

export interface Guard extends GuardSetup {
  due_date: string;
  status: "open" | "closed";  
}

export interface GuardListItem extends Guard {
  services_count: number;
}

export interface Service {
  id: number;
  guard_id: number;
  position: number;
  full_name: string;
  age: number | null;
  due_date: string;
  status: "pending" | "completed";
  priority: "urgent" | null;
  health_facility_place: string | null;
  pathology: string | null;
  health_facility: { id: number; name: string } | null;
  created_by: UserSummary;
}

export interface ServiceDetail extends Service {
  address: string | null;
  caller_full_name: string | null;
  caller_phone: string | null;
  caller_relationship: string | null;
  health_status: string | null;
  sacraments: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  comments_count: number;
  guard: { id: number; day_number: number; due_date: string; status: Guard["status"] };
}

export interface GuardsPage {
  guards: GuardListItem[];
  today_guard_setup: GuardSetup;
  page: number;
  total_pages: number;
}

export interface ServicesToday {
  current_guard: Guard | null;
  services: Service[];
  pending_other_services: (Service & { guard_due_date: string })[];
}

export interface ServicesSearch {
  filters: Record<string, string>;
  results: Service[];
  results_count: number;
  page: number;
  total_pages: number;
}

export interface Church {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
}

export interface HealthFacility {
  id: number;
  name: string;
  address: string;
}
