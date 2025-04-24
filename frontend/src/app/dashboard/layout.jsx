import LayoutWrapperDashboard from "@/components/Dashboard/LayoutWrapperDashboard";
import ProtectedRoute from "@/utils/protectedRoute";

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <LayoutWrapperDashboard>{children}</LayoutWrapperDashboard>
    </ProtectedRoute>
  );
}
