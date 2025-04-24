"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StateProvider } from "./StateContext";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { usePathname } from "next/navigation";
import ChatBot from "@/components/Shared/ChatBot";

export default function LayoutWrapper({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  const showFooter =
    !pathname?.includes("/dashboard") &&
    !pathname?.includes("/login") &&
    !pathname?.includes("/signup") &&
    !pathname?.includes("/forgot-password") &&
    !pathname?.startsWith("/reset-password");

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <StateProvider>
        <QueryClientProvider client={queryClient}>
          {!pathname?.includes("/dashboard") && <Header />}
          {children}
          {/* {!pathname?.startsWith("/dashboard") && <ChatBot />} */}
          <ChatBot />
          {showFooter && <Footer />}
        </QueryClientProvider>
      </StateProvider>
    </>
  );
}
