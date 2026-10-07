import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { ReleasesPage } from "./pages/ReleasesPage";
import { ReleaseDetailPage } from "./pages/ReleaseDetailPage";
import { JiraPage } from "./pages/JiraPage";
import { KubernetesPage } from "./pages/KubernetesPage";
import { MailsPage } from "./pages/MailsPage";
import { ApprovalsPage } from "./pages/ApprovalsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { AiInsightsPage } from "./pages/AiInsightsPage";
import { ProductionAlignmentPage } from "./pages/ProductionAlignmentPage";
import { ProductionAlignmentDetailPage } from "./pages/ProductionAlignmentDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ROUTES } from "./routes/paths";
import { useAppStore } from "./store/useAppStore";
import { ToastViewport } from "./components/common/ToastViewport";
import { CommandPalette } from "./components/layout/CommandPalette";

function App() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.releases} element={<ReleasesPage />} />
          <Route path={ROUTES.releaseDetail} element={<ReleaseDetailPage />} />
          <Route path={ROUTES.jira} element={<JiraPage />} />
          <Route path={ROUTES.kubernetes} element={<KubernetesPage />} />
          <Route path={ROUTES.mails} element={<MailsPage />} />
          <Route path={ROUTES.approvals} element={<ApprovalsPage />} />
          <Route path={ROUTES.reports} element={<ReportsPage />} />
          <Route path={ROUTES.calendar} element={<CalendarPage />} />
          <Route path={ROUTES.aiInsights} element={<AiInsightsPage />} />
          <Route path={ROUTES.productionAlignment} element={<ProductionAlignmentPage />} />
          <Route
            path={ROUTES.productionAlignmentDetail}
            element={<ProductionAlignmentDetailPage />}
          />
          <Route path={ROUTES.settings} element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ToastViewport />
      <CommandPalette />
    </BrowserRouter>
  );
}

export default App;
