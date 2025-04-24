"use client";
import { createContext, useContext, useState } from "react";

const StateContext = createContext({});

// Create a provider component
export function StateProvider({ children }) {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentDashboardTab, setCurrentDashboardTab] = useState("Dashboard");

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        openLoginModal,
        setOpenLoginModal,
        openSignupModal,
        setOpenSignupModal,
        currentDashboardTab,
        setCurrentDashboardTab,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

// Custom hook to access the context
export function useStateContext() {
  return useContext(StateContext);
}
