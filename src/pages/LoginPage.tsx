import { useActionState, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const inputClass =
  "w-full rounded-md bg-white/10 border border-white/20 px-4 py-2.5 text-white placeholder-indigo-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent";

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
      renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
      prompt: () => void;
    };
  };
}

// Google's sign-in button and One Tap prompt. Google gives the page an ID token, which the API exchanges for its own.
function GoogleSignIn({ onError }: { onError: (message: string) => void }) {
  const { signInWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      const google = (window as unknown as { google?: GoogleIdentity }).google;
      if (!google || !buttonRef.current) return;
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: ({ credential }) => signInWithGoogle(credential).catch((error: Error) => onError(error.message)),
      });
      google.accounts.id.renderButton(buttonRef.current, { theme: "outline", size: "large", width: 320, locale: "es" });
      google.accounts.id.prompt();
    };
    document.head.append(script);
    return () => script.remove();
  }, [signInWithGoogle, onError]);

  if (!GOOGLE_CLIENT_ID) return null;
  return (
    <>
      <div className="my-5 flex items-center gap-3 text-xs text-indigo-300">
        <span className="h-px flex-1 bg-white/20"></span>o<span className="h-px flex-1 bg-white/20"></span>
      </div>
      <div ref={buttonRef} className="flex justify-center"></div>
    </>
  );
}

export function LoginPage() {
  const { signedIn, signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  // React resets the form after the action, so a failed attempt keeps the email it was made with.
  const [state, submit, pending] = useActionState(
    async (_previous: { error: string | null; email: string }, form: FormData) => {
      const email = String(form.get("email"));
      try {
        await signIn(email, String(form.get("password")));
        return { error: null, email };
      } catch (error) {
        return { error: (error as Error).message, email };
      }
    },
    { error: null, email: "" },
  );

  if (signedIn) return <Navigate to="/services" replace />;
  const message = state.error ?? googleError;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 border border-white/20 mb-4">
            <img src="/icon.svg" alt="" className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">Iniciar sesión</h1>
          <p className="text-sm text-indigo-300 mt-1">Servicio Sacerdotal de Urgencia y Nocturnos</p>
        </div>

        <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          {message && (
            <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-md bg-red-900 border border-red-700 text-red-200">
              <i className="ph ph-warning-circle text-lg shrink-0"></i>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <form action={submit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-1.5">Email</label>
              <input id="email" name="email" type="email" required autoFocus autoComplete="email" defaultValue={state.email} placeholder="tu@email.com" className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-indigo-300 hover:text-white"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <i className={`ph ${showPassword ? "ph-eye-slash" : "ph-eye"} text-lg`}></i>
                </button>
              </div>
            </div>
            <div className="pt-1">
              <button
                type="submit"
                disabled={pending}
                className="cursor-pointer w-full rounded-md bg-white text-indigo-900 px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-50 disabled:opacity-60"
              >
                {pending ? "Ingresando…" : "Ingresar"}
              </button>
            </div>
          </form>

          <GoogleSignIn onError={setGoogleError} />
        </div>
      </div>
    </div>
  );
}
