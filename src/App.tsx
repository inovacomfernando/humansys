import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";

// Auth pages
import Login from "./pages/Login";

// Main app pages
import Dashboard from "./pages/Dashboard";
import { FounderDashboard } from "./pages/FounderDashboard";
import Collaborators from "./pages/Collaborators";
import Onboarding from "./pages/Onboarding";
import Training from "./pages/Training";
import Feedback from "./pages/Feedback";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Changelog from "./pages/Changelog";
import Settings from "./pages/Settings";
import Certificates from "./pages/Certificates";
import Documents from "./pages/Documents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/founder-dashboard" element={<FounderDashboard />} />
              
              <Route path="/collaborators" element={<Collaborators />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/training" element={<Training />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/documents" element={<Documents />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
