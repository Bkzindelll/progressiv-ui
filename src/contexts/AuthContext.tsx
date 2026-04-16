import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: AppRole;
  loading: boolean;
  isReady: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: "client",
  loading: true,
  isReady: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>("client");
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const initialized = useRef(false);

  const fetchRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      if (data?.role) setRole(data.role as AppRole);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Use setTimeout to avoid deadlock with Supabase internals
          setTimeout(() => fetchRole(session.user.id), 0);
        } else {
          setRole("client");
        }
        setLoading(false);
        setIsReady(true);
      }
    );

    // THEN restore session
    if (!initialized.current) {
      initialized.current = true;
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchRole(session.user.id).then(() => {
            setLoading(false);
            setIsReady(true);
          });
        } else {
          setLoading(false);
          setIsReady(true);
        }
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole("client");
  };

  return (
    <AuthContext.Provider value={{ session, user, role, loading, isReady, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
