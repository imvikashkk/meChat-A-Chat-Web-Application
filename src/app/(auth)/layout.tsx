"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../../lib/firebase";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const path = usePathname();
const [loading, setLoading] = useState<boolean>(true);
useEffect(() => {
    setLoading(true);
    new Promise<void>((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                if (path !== "/login" && path !== "/register" && path !== "/forgot-password") {
                    router.replace("/login");
                }
                setLoading(()=>false);
            } else if (user) {
                router.replace("/");
            }
        });
    });
    
},[path, router]);
  return !loading ? <>{children}</> : <div className='text-4xl'>Loading...</div>;
};

export default Layout;
