import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const FounderDashboard = React.lazy(() => import('@/pages/FounderDashboard').then(module => ({ default: module.FounderDashboard })));
const Login = React.lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Landing = React.lazy(() => import('@/pages/Landing').then(module => ({ default: module.Landing })));
const Profile = React.lazy(() => import('@/pages/Profile').then(module => ({ default: module.Profile })));
const SecurityManagement = React.lazy(() => import('@/pages/SecurityManagement').then(module => ({ default: module.SecurityManagement })));

// Lazy load BrainsysIAO component
const BrainsysIAO = React.lazy(() => import('@/pages/BrainsysIAO').then(module => ({ default: module.BrainsysIAO })));
import { OptimizedCollaborators } from '@/pages/OptimizedCollaborators';
import { OptimizedRecruitment } from '@/pages/OptimizedRecruitment';
import Index from '@/pages/Index';
import { Onboarding } from '@/pages/Onboarding';
import { Training } from '@/pages/Training';
import { Feedback } from '@/pages/Feedback';
import { Goals } from '@/pages/Goals';
import { Analytics } from '@/pages/Analytics';
import { Changelog } from '@/pages/Changelog';
import { Documentation } from '@/pages/Documentation';
import { Settings } from '@/pages/Settings';
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
        {/* Rota inicial */}
        <Route path="/" element={<Index />} />

        {/* Rotas públicas */}
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<ProtectedRoute requireAuth={false}><Login /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Rotas do Founder */}
        <Route path="/founder/dashboard" element={<ProtectedRoute requiredRole="founder"><FounderDashboard /></ProtectedRoute>} />

        {/* Rotas do App Principal - Todas as rotas /app/* ficam aqui */}
        <Route path="/app/*" element={
          <ProtectedRoute>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="brainsys-iao" element={<BrainsysIAO />} />
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
              <Route path="profile" element={<Profile />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="documents" element={<Documents />} />
              <Route path="meetings" element={<Meetings />} />
              <Route path="surveys" element={<ModernSurveys />} />
              <Route path="disc" element={<Disc />} />
              <Route path="security-management" element={<SecurityManagement />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Rotas de compatibilidade (redirecionam para /app/[page]) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/brainsys-iao" element={<ProtectedRoute><BrainsysIAO /></ProtectedRoute>} />
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

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};