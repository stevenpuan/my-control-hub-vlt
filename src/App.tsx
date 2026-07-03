import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";
import AuthPage from "@/pages/AuthPage";
import SaaSDirectory from "@/pages/SaaSDirectory";
import LicensesPage from "@/pages/LicensesPage";
import CostsPage from "@/pages/CostsPage";
import AccountsPage from "@/pages/AccountsPage";
import HandoverPage from "@/pages/HandoverPage";
import OAuthPage from "@/pages/OAuthPage";
import SharingPage from "@/pages/SharingPage";
import UsagePage from "@/pages/UsagePage";
import RenewalPage from "@/pages/RenewalPage";
import CompliancePage from "@/pages/CompliancePage";
import PrivilegedPage from "@/pages/PrivilegedPage";
import IntegrationsPage from "@/pages/IntegrationsPage";
import PermissionsPage from "@/pages/PermissionsPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<SaaSDirectory />} />
              <Route path="/licenses" element={<LicensesPage />} />
              <Route path="/costs" element={<CostsPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/handover" element={<HandoverPage />} />
              <Route path="/oauth" element={<OAuthPage />} />
              <Route path="/sharing" element={<SharingPage />} />
              <Route path="/usage" element={<UsagePage />} />
              <Route path="/renewal" element={<RenewalPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/privileged" element={<PrivilegedPage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/permissions" element={<PermissionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
