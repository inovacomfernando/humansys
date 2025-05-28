
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppRouter } from "@/components/auth/AppRouter";
import { GlobalErrorBoundary } from "@/components/common/GlobalErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry auth errors
        if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
          return false;
        }
        return failureCount < 2; // Reduzido de 3 para 2 tentativas
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always'
    }
  }
});

// Make query cache available globally for clearing
declare global {
  interface Window {
    queryCache: Map<any, any>;
  }
}

window.queryCache = queryClient.getQueryCache() as any;

const App = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export default App;
