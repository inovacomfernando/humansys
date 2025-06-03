
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ModernIAOCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white border-0 shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Brainsys IAO V.1</h3>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mt-1">
                BETA
              </Badge>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={() => navigate('/brainsys-iao')}
          >
            <Zap className="h-4 w-4 mr-2" />
            Acessar IAO
          </Button>
        </div>

        <p className="text-blue-100 mb-6 text-sm">
          Orquestrador de Inteligência Organizacional
        </p>

        <div className="flex items-center space-x-6 text-sm">
          <div className="text-center">
            <span className="block text-xs text-blue-200">IA Preditiva Ativa</span>
          </div>
          <div className="text-center">
            <span className="block text-xs text-blue-200">ML Learning</span>
          </div>
          <div className="text-center">
            <span className="block text-xs text-blue-200">Memória Contextual</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">94.7%</div>
            <div className="text-xs text-blue-200">Precisão dos Insights</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-blue-200">Ações Sugeridas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">R$ 45,2K</div>
            <div className="text-xs text-blue-200">Potencial/Mês</div>
          </div>
        </div>

        <div className="text-right mt-4">
          <span className="text-xs text-blue-200">Powered by</span>
          <div className="text-sm font-semibold">Anthropic API</div>
        </div>
      </CardContent>
    </Card>
  );
};
