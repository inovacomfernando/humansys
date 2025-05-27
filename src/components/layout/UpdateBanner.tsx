
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles, Brain, X } from 'lucide-react';
import { useUserMigration } from '@/hooks/useUserMigration';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const UpdateBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { migrationStatus, runFullMigration } = useUserMigration();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem('@humansys:update-banner-v2.5.0');
    if (!hasSeenBanner && user) {
      setTimeout(() => setIsVisible(true), 1000); // Mostrar após 1 segundo
    }
  }, [user]);

  const dismissBanner = () => {
    localStorage.setItem('@humansys:update-banner-v2.5.0', 'true');
    setIsVisible(false);
  };

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  const handleMigration = async () => {
    const result = await runFullMigration();
    if (result) {
      setMigrationComplete(true);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <Card className="relative mb-6 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500"></div>
          <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-purple-500"></div>
        </div>
        
        <div className="relative p-6">
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={dismissBanner}
          >
            <X size={18} />
          </button>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0 p-3 bg-white rounded-full shadow-sm">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            
            <div className="flex-grow">
              <h3 className="text-lg font-medium text-blue-900">
                Novidades no HumanSys! Sua plataforma evoluiu
              </h3>
              <p className="text-blue-800 opacity-90">
                Gamificação, IA avançada e uma nova experiência Mobile foram adicionadas ao sistema.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
              <Button size="sm" onClick={handleShowDetails}>
                Ver novidades
              </Button>
              <Button size="sm" variant="outline" onClick={dismissBanner}>
                Mais tarde
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>Novidades na Plataforma</span>
            </DialogTitle>
            <DialogDescription>
              Conheça as novas funcionalidades que acabaram de ser lançadas.
            </DialogDescription>
          </DialogHeader>
          
          {!migrationComplete ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Trophy className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Sistema de Gamificação</h3>
                    <p className="text-sm text-muted-foreground">
                      Conquiste badges, acumule pontos e veja seu progresso em rankings para aumentar o engajamento.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Brain className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Inteligência Artificial Avançada</h3>
                    <p className="text-sm text-muted-foreground">
                      Analytics preditiva, insights automáticos e recomendações inteligentes para suas decisões.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="font-medium">Experiência Mobile (PWA)</h3>
                    <p className="text-sm text-muted-foreground">
                      Acesse a plataforma de qualquer lugar e disponibilize para seus colaboradores no celular.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Migração automática
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Podemos preparar sua conta automaticamente para usar todas as novas funcionalidades, incluindo pontos retroativos de gamificação.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Mais tarde
                </Button>
                <Button onClick={handleMigration}>
                  Ativar novidades
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-medium">Migração concluída com sucesso!</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  Todas as novas funcionalidades estão disponíveis em sua conta agora.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => {
                    setShowDetails(false);
                    navigate('/onboarding');
                  }}>
                    Ver Onboarding com Gamificação
                  </Button>
                  <Button variant="outline" onClick={() => {
                    dismissBanner();
                    setShowDetails(false);
                  }}>
                    Continuar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
