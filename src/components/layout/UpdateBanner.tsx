
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpdateBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dismissed = localStorage.getItem('@humansys:update-banner-v2.5.0');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('@humansys:update-banner-v2.5.0', 'true');
    setIsVisible(false);
  };

  const handleViewChangelog = () => {
    navigate('/changelog');
    handleDismiss();
  };

  if (!isVisible) return null;

  return (
    <Card className="mx-4 mt-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">Novas Funcionalidades Disponíveis!</h3>
                <Badge className="bg-purple-500">v2.5.0</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Analytics com IA, Sistema de Gamificação e muito mais
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleViewChangelog} variant="outline" size="sm">
              Ver Novidades
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button onClick={handleDismiss} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
