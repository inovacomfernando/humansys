import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const FounderDashboard = React.lazy(() => import('@/pages/FounderDashboard').then(module => ({ default: module.FounderDashboard })));
const Login = React.lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Landing = React.lazy(() => import('@/pages/Landing').then(module => ({ default: module.Landing })));
import { BrainsysIAO } from '@/pages/BrainsysIAO';

// Import optimized components
import { OptimizedCollaborators } from '@/pages/OptimizedCollaborators';
import { OptimizedRecruitment } from '@/pages/OptimizedRecruitment';

// Other imports stay synchronous for now
import Index from '@/pages/Index';
import { Onboarding } from '@/pages/Onboarding';
import { Training } from '@/pages/Training';
import { Feedback } from '@/pages/Feedback';
import { Goals } from '@/pages/Goals';
import { Analytics } from '@/pages/Analytics';
import { Changelog } from '@/pages/Changelog';
import { Documentation } from '@/pages/Documentation';
import { Settings } from '@/pages/Settings';
const Profile = React.lazy(() => import('@/pages/Profile').then(module => ({ default: module.Profile })));
import { Certificates } from '@/pages/Certificates';
import { Documents } from '@/pages/Documents';
import { Meetings } from '@/pages/Meetings';
import { ModernSurveys } from '@/pages/ModernSurveys';
import { Checkout } from '@/pages/Checkout';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Help } from '@/pages/Help';
import NotFound from '@/pages/NotFound';
import { Disc } from '@/pages/Disc';
const SecurityManagement = React.lazy(() => import('@/pages/SecurityManagement').then(module => ({ default: module.SecurityManagement })));

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
              <OptimizedCollaborators />
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
          path="/app/profile" 
          element={
            <ProtectedRoute>
              <Profile />
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

        <Route 
          path="/app/disc" 
          element={
            <ProtectedRoute>
              <Disc />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/app/documentation" 
          element={
            <ProtectedRoute>
              <Documentation />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/app/security" 
          element={
            <ProtectedRoute requiredRole="founder">
              <SecurityManagement />
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
        
        {/* Rota específica para BrainsysIAO */}
        <Route 
          path="/app/brainsys-iao" 
          element={
            <ProtectedRoute>
              <BrainsysIAO />
            </ProtectedRoute>
          } 
        />

        {/* Rotas Protegidas do App */}
        <Route path="/app/*" element={<ProtectedRoute><Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="collaborators" element={<OptimizedCollaborators />} />
          <Route path="recruitment" element={<OptimizedRecruitment />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="training" element={<Training />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="goals" element={<Goals />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="settings" element={<Settings />} />
          <Route path="disc" element={<Disc />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="documents" element={<Documents />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="surveys" element={<ModernSurveys />} />
          <Route path="profile" element={<Profile />} />
          <Route path="security-management" element={<SecurityManagement />} />
        </Routes></ProtectedRoute>} />

        {/* Rotas Públicas Institucionais */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Redirects para manter compatibilidade - redirecionam para /app/[page] */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/founder-dashboard" element={<ProtectedRoute requiredRole="founder"><FounderDashboard /></ProtectedRoute>} />
        <Route path="/collaborators" element={<ProtectedRoute><OptimizedCollaborators /></ProtectedRoute>} />
        <Route path="/recruitment" element={<ProtectedRoute><OptimizedRecruitment /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/changelog" element={<ProtectedRoute><Changelog /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
         <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
        <Route path="/surveys" element={<ProtectedRoute><ModernSurveys /></ProtectedRoute>} />
        <Route path="/disc" element={<ProtectedRoute><Disc /></ProtectedRoute>} />
        <Route path="/documentation" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />

        {/* 404 page for unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};