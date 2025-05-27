
import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

const DefaultFallback = ({ minHeight = "200px" }: { minHeight?: string }) => (
  <Card style={{ minHeight }}>
    <CardContent className="p-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback,
  minHeight = "200px" 
}) => {
  return (
    <Suspense fallback={fallback || <DefaultFallback minHeight={minHeight} />}>
      {children}
    </Suspense>
  );
};

// HOC para tornar componentes lazy
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: P) => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyWrapper>
  );
};

// Lazy load dos componentes de analytics
export const LazyPredictiveAnalytics = withLazyLoading(
  () => import('@/components/analytics/PredictiveAnalytics')
);

export const LazyEngagementAnalytics = withLazyLoading(
  () => import('@/components/analytics/EngagementAnalytics')
);

export const LazyProductivityAnalytics = withLazyLoading(
  () => import('@/components/analytics/ProductivityAnalytics')
);

export const LazyMLInsights = withLazyLoading(
  () => import('@/components/analytics/MLInsights')
);
