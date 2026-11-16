import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, setUnauthorizedHandler } from "../api/client";
import type { Me, SignInResponse } from "../api/types";
import { storage } from "./storage";

interface AuthValue {
  me: Me | undefined;
  isLoading: boolean;
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  signOut: () => void;
  switchHeadquarter: (id: number) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(storage.token);

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => api<Me>("/me"),
    enabled: token !== null,
    staleTime: 5 * 60_000,
  });

  const signOut = useCallback(() => {
    storage.setToken(null);
    storage.setHeadquarterId(null);
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => setUnauthorizedHandler(signOut), [signOut]);

  const start = useCallback(
    (response: SignInResponse) => {
      storage.setToken(response.token);
      storage.setHeadquarterId(null);
      queryClient.clear();
      queryClient.setQueryData<Me>(["me"], { user: response.user, headquarter: response.headquarter });
      setToken(response.token);
    },
    [queryClient],
  );

  const value = useMemo<AuthValue>(
    () => ({
      me: token ? meQuery.data : undefined,
      isLoading: token !== null && meQuery.isPending,
      signedIn: token !== null,
      signIn: async (email, password) => start(await api<SignInResponse>("/session", { method: "POST", body: { email, password } })),
      signInWithGoogle: async (credential) =>
        start(await api<SignInResponse>("/session/google", { method: "POST", body: { credential } })),
      signOut,
      // The API scopes every request to this sede (only super admins can pick one); everything cached was the old one's.
      switchHeadquarter: (id) => {
        storage.setHeadquarterId(id);
        queryClient.resetQueries();
      },
    }),
    [token, meQuery.data, meQuery.isPending, start, signOut, queryClient],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const value = use(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
