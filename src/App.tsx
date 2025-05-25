
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Landing } from "./pages/Landing";
import { Plans } from "./pages/Plans";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Checkout } from "./pages/Checkout";
import { Profile } from "./pages/Profile";
import { Collaborators } from "./pages/Collaborators";
import { Recruitment } from "./pages/Recruitment";
import { Onboarding } from "./pages/Onboarding";
import { Feedback } from "./pages/Feedback";
import { Meetings } from "./pages/Meetings";
import { Goals } from "./pages/Goals";
import { Training } from "./pages/Training";
import { Certificates } from "./pages/Certificates";
import { Surveys } from "./pages/Surveys";
import { Documents } from "./pages/Documents";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/trial" element={<Plans />} />
      <Route path="/checkout" element={<Checkout />} />
      
      {/* Rotas protegidas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/collaborators" element={
        <ProtectedRoute>
          <Collaborators />
        </ProtectedRoute>
      } />
      
      <Route path="/recruitment" element={
        <ProtectedRoute>
          <Recruitment />
        </ProtectedRoute>
      } />
      
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />
      
      <Route path="/feedback" element={
        <ProtectedRoute>
          <Feedback />
        </ProtectedRoute>
      } />
      
      <Route path="/meetings" element={
        <ProtectedRoute>
          <Meetings />
        </ProtectedRoute>
      } />
      
      <Route path="/goals" element={
        <ProtectedRoute>
          <Goals />
        </ProtectedRoute>
      } />
      
      <Route path="/training" element={
        <ProtectedRoute>
          <Training />
        </ProtectedRoute>
      } />
      
      <Route path="/certificates" element={
        <ProtectedRoute>
          <Certificates />
        </ProtectedRoute>
      } />
      
      <Route path="/surveys" element={
        <ProtectedRoute>
          <Surveys />
        </ProtectedRoute>
      } />
      
      <Route path="/documents" element={
        <ProtectedRoute>
          <Documents />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
