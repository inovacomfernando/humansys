
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
import { NotFound } from '@/pages/NotFound';

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
