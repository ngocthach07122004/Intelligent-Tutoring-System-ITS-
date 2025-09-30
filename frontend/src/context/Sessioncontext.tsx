"use client";

import { getAuthenticatedInfo } from "@/app/api/user"; // Use API from the api folder
import { usePathname, useRouter } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

interface userSession {
    id: string;
    name: string;
    email: string;
    avaUrl: string;
}

interface SessionContextType {
    status: "loading" | "authenticated" | "unauthenticated";
    session: null | userSession;
    setSession: Dispatch<SetStateAction<null | userSession>>;
}

const SessionContext = createContext<SessionContextType>({
    status: "loading",
    session: null,
    setSession: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
    const [session, setSession] = useState<null | userSession>(null);
    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const infoRes = await getAuthenticatedInfo(); // Use the API function
                if (infoRes.status !== 200) {
                    router.push("/auth/login");                 
                    setStatus("unauthenticated");
                    return;
                }

                const session = { ...infoRes.data };
                setSession(session);
                setStatus("authenticated");
            } catch (error) {
                console.error("Error fetching user info:", error);
                if (pathName !== "/auth/login" && pathName !== "/auth/signup") {
                    router.push("/auth/login");                 
                    setStatus("unauthenticated");
                    return;
                }             
                setStatus("unauthenticated");
            }
        };

        fetchData();
    }, [pathName]);

    return (
        <SessionContext.Provider value={{ status, session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}