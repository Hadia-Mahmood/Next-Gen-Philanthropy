"use client";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import {
  sidebarLinksBeneficiary,
  sidebarLinksOrganization,
  sidebarLinksUser,
  sidebarLinksDonor,
} from "@/app/data";
import PageLoader from "@/components/Shared/PageLoader";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? Cookies.get("jwt") : null;

    if (!token) {
      if (pathname.startsWith("/dashboard")) {
        router.push("/login");
      }
    } else {
      const decodedToken = jwt.decode(token.substring(7));
      const userRole = decodedToken?.role;

      const rolePaths = {
        donor:sidebarLinksDonor[0]?.linkTo,
        beneficiary:sidebarLinksBeneficiary[0]?.linkTo,
        admin: sidebarLinksOrganization[0]?.linkTo,
       
        user: sidebarLinksUser[0]?.linkTo,
      };

      if (pathname === "/login" || pathname === "/signup") {
        router.push("/");
        setLoading(false);
        return;
      }

      const allowedBasePath = rolePaths[userRole];

      if (pathname.startsWith(allowedBasePath)) {
        setLoading(false);
        return;
      } else {
        router.push(allowedBasePath);
      }
    }

    setLoading(false);
  }, [pathname]);

  if (loading) {
    return <PageLoader />;
  }

  return children;
};

export default ProtectedRoute;
