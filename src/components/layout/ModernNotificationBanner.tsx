
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, ArrowRight } from 'lucide-react';

export const ModernNotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="mx-6 mt-6 mb-4 border-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-sm">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Sparkles className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Novidades no OrientoHub! Sua plataforma evoluiu
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Gamificação, IA avançada e uma nova experiência Mobile foram adicionadas ao sistema.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Ver novidades
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            Mais tarde
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
