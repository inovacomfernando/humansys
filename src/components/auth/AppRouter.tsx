import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const FounderDashboard = React.lazy(() => import('@/pages/FounderDashboard').then(module => ({ default: module.FounderDashboard })));
const Login = React.lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Landing = React.lazy(() => import('@/pages/Landing').then(module => ({ default: module.Landing })));

// Import optimized components
import { OptimizedCollaboratorsFixed } from '@/pages/OptimizedCollaboratorsFixed';
import { OptimizedRecruitment } from '@/pages/OptimizedRecruitment';

// Other imports stay synchronous for now
import Index from '@/pages/Index';
import { Onboarding } from '@/pages/Onboarding';
import { Training } from '@/pages/Training';
import { Feedback } from '@/pages/Feedback';
import { Goals } from '@/pages/Goals';
import { Analytics } from '@/pages/Analytics';
import { Changelog } from '@/pages/Changelog';
import { Settings } from '@/pages/Settings';
import { Certificates } from '@/pages/Certificates';
import { Documents } from '@/pages/Documents';
import { Meetings } from '@/pages/Meetings';
import { ModernSurveys } from '@/pages/ModernSurveys';
import { Checkout } from '@/pages/Checkout';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Help } from '@/pages/Help';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

export const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rota inicial - mostra landing page ou redireciona */}
        <Route path="/" element={<Index />} />
        
        {/* Rota pública para landing page */}
        <Route path="/home" element={<Landing />} />
        
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas do App Principal */}
        <Route 
          path="/app/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/collaborators" 
          element={
            <ProtectedRoute>
              <OptimizedCollaboratorsFixed />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/recruitment" 
          element={
            <ProtectedRoute>
              <OptimizedRecruitment />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/onboarding" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/training" 
          element={
            <ProtectedRoute>
              <Training />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/feedback" 
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/meetings" 
          element={
            <ProtectedRoute>
              <Meetings />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/goals" 
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/surveys" 
          element={
            <ProtectedRoute>
              <ModernSurveys />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/changelog" 
          element={
            <ProtectedRoute>
              <Changelog />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/certificates" 
          element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/app/documents" 
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          } 
        />

        {/* Rotas do Founder */}
        <Route 
          path="/founder/dashboard" 
          element={
            <ProtectedRoute requiredRole="founder">
              <FounderDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Rota pública para checkout */}
        <Route path="/checkout" element={<Checkout />} />
        
        {/* Rotas Públicas Institucionais */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        
        {/* Redirects para manter compatibilidade */}
        <Route path="/dashboard" element={<Index />} />
        <Route path="/founder-dashboard" element={<Index />} />
        <Route path="/collaborators" element={<Index />} />
        <Route path="/recruitment" element={<Index />} />
        <Route path="/onboarding" element={<Index />} />
        <Route path="/training" element={<Index />} />
        <Route path="/feedback" element={<Index />} />
        <Route path="/goals" element={<Index />} />
        <Route path="/analytics" element={<Index />} />
        <Route path="/changelog" element={<Index />} />
        <Route path="/settings" element={<Index />} />
        <Route path="/certificates" element={<Index />} />
        <Route path="/documents" element={<Index />} />
        <Route path="/meetings" element={<Index />} />
        <Route path="/surveys" element={<Index />} />
        
        {/* Fallback - redireciona para a página inicial */}
        <Route path="/*" element={<Index />} />
      </Routes>
    </Suspense>
  );
};
