import { useState } from "react";
import { useLocation } from "react-router-dom";

export const useDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Logic to determine if we are looking at the main stats or a sub-page
  const isOverview = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return {
    isSidebarOpen,
    isOverview,
    openSidebar,
    closeSidebar,
  };
};