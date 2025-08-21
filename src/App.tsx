import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from './state/auth'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ResetPage from './pages/auth/ResetPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import OnboardingPage from './pages/onboarding/OnboardingPage'
import JobsPage from './pages/jobs/JobsPage'
import JobCreatePage from './pages/jobs/JobCreatePage'
import JobDetailPage from './pages/jobs/JobDetailPage'
import CalendarPage from './pages/calendar/CalendarPage'
import QuotesPage from './pages/quotes/QuotesPage'
import QuoteBuilderPage from './pages/quotes/QuoteBuilderPage'
import QuotePreviewPage from './pages/quotes/QuotePreviewPage'
import InvoicesPage from './pages/invoices/InvoicesPage'
import InvoiceDetailPage from './pages/invoices/InvoiceDetailPage'
import InvoiceBuilderPage from './pages/invoices/InvoiceBuilderPage'
import ClientsPage from './pages/clients/ClientsPage'
import ClientCreatePage from './pages/clients/ClientCreatePage'
import ClientDetailPage from './pages/clients/ClientDetailPage'
import InboxPage from './pages/inbox/InboxPage'
import MarketingPage from './pages/marketing/MarketingPage'
import ReportsPage from './pages/reports/ReportsPage'
import SettingsPage from './pages/settings/SettingsPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import NotFoundPage from './pages/NotFoundPage'
import LandingPage from './pages/public/LandingPage'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

function Protected({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { isAuthenticated, needsOnboarding } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (needsOnboarding && location.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Public landing */}
          <Route
            path="/welcome"
            element={
              <PublicOnly>
                <LandingPage />
              </PublicOnly>
            }
          />

          {/* Auth */}
          <Route
            path="/login"
            element={
              <PublicOnly>
                <LoginPage />
              </PublicOnly>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnly>
                <SignupPage />
              </PublicOnly>
            }
          />
          <Route
            path="/reset"
            element={
              <PublicOnly>
                <ResetPage />
              </PublicOnly>
            }
          />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <Protected>
                <OnboardingPage />
              </Protected>
            }
          />

          {/* App */}
          <Route
            path="/"
            element={
              <Protected>
                <AppLayout />
              </Protected>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/new" element={<JobCreatePage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="quotes/new" element={<QuoteBuilderPage />} />
            <Route path="quotes/:id" element={<QuoteBuilderPage />} />
            <Route path="quotes/:id/preview" element={<QuotePreviewPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/new" element={<InvoiceBuilderPage />} />
            <Route path="invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/new" element={<ClientCreatePage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="marketing" element={<MarketingPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
