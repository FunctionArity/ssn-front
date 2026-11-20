import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { GuardSetup } from "../api/types";
import { ErrorMessage, Loading } from "../components/ui";

export function NewGuardPage() {
  const [searchParams] = useSearchParams();
  const guardSetupId = searchParams.get("guard_setup_id");
  const { data, error, isPending } = useQuery({
    queryKey: ["guard_setups", "detail", guardSetupId],
    queryFn: () =>
      api<{ guard_setup: GuardSetup }>(`/guard_setups/${guardSetupId}`),
    enabled: guardSetupId !== null,
  });

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
