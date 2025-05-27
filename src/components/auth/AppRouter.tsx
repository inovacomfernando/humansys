import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const FounderDashboard = React.lazy(() => import('@/pages/FounderDashboard').then(module => ({ default: module.FounderDashboard })));
const Login = React.lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));

// Other imports stay synchronous for now
import { Collaborators } from '@/pages/Collaborators';
import { Onboarding } from '@/pages/Onboarding';
import { Training } from '@/pages/Training';
import { Feedback } from '@/pages/Feedback';
import { Goals } from '@/pages/Goals';
import { Analytics } from '@/pages/Analytics';
import { Changelog } from '@/pages/Changelog';
import { Settings } from '@/pages/Settings';
import { Certificates } from '@/pages/Certificates';
import { Documents } from '@/pages/Documents';

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
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/founder-dashboard" 
          element={
            <ProtectedRoute requiredRole="founder">
              <FounderDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/collaborators" 
          element={
            <ProtectedRoute>
              <Collaborators />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/training" 
          element={
            <ProtectedRoute>
              <Training />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/feedback" 
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/goals" 
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/changelog" 
          element={
            <ProtectedRoute>
              <Changelog />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/certificates" 
          element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/documents" 
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
};
