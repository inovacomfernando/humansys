import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from "@/components/ui/toaster";
import { AppRouter } from '@/components/auth/AppRouter';
import { GlobalErrorBoundary } from '@/components/common/GlobalErrorBoundary';

// Public pages
import Index from '@/pages/Index';
import { Plans } from '@/pages/Plans';
import { Checkout } from '@/pages/Checkout';
import { Login } from '@/pages/Login';
import { PublicChangelog } from '@/pages/PublicChangelog';
import { About } from '@/pages/About';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { TermsOfService } from '@/pages/TermsOfService';
import { Documentation } from '@/pages/Documentation';
import { Contact } from '@/pages/Contact';
import { Help } from '@/pages/Help';
import { Careers } from '@/pages/Careers';
import { Blog } from '@/pages/Blog';
import NotFound from '@/pages/NotFound';

import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/changelog" element={<PublicChangelog />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/blog" element={<Blog />} />

                {/* Protected app routes */}
                <Route path="/app/*" element={<AppRouter />} />
                <Route path="/founder/*" element={<AppRouter />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GlobalErrorBoundary } from "@/components/common/GlobalErrorBoundary";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Collaborators from "./pages/Collaborators";
import OptimizedCollaborators from "./pages/OptimizedCollaborators";
import Recruitment from "./pages/Recruitment";
import OptimizedRecruitment from "./pages/OptimizedRecruitment";
import Onboarding from "./pages/Onboarding";
import Training from "./pages/Training";
import Feedback from "./pages/Feedback";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Meetings from "./pages/Meetings";
import Surveys from "./pages/Surveys";
import ModernSurveys from "./pages/ModernSurveys";
import Certificates from "./pages/Certificates";
import ModernCertificates from "./pages/ModernCertificates";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Plans from "./pages/Plans";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Help from "./pages/Help";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Documentation from "./pages/Documentation";
import PublicChangelog from "./pages/PublicChangelog";
import Changelog from "./pages/Changelog";
import FounderDashboard from "./pages/FounderDashboard";
import NotFound from "./pages/NotFound";
import { Disc } from "./pages/Disc";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <GlobalErrorBoundary>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/help" element={<Help />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/changelog" element={<PublicChangelog />} />

                {/* Protected routes */}
                <Route path="/app" element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="collaborators" element={<OptimizedCollaborators />} />
                  <Route path="recruitment" element={<OptimizedRecruitment />} />
                  <Route path="onboarding" element={<Onboarding />} />
                  <Route path="training" element={<Training />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="meetings" element={<Meetings />} />
                  <Route path="surveys" element={<ModernSurveys />} />
                  <Route path="certificates" element={<ModernCertificates />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="disc" element={<Disc />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="changelog" element={<Changelog />} />
                  <Route path="founder/dashboard" element={<FounderDashboard />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </GlobalErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
