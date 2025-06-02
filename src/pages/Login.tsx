
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Sparkles, Crown, Zap, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao RH System",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signUp(signupData.email, signupData.password, signupData.name);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seu teste grátis de 30 dias foi ativado. Bem-vindo ao RH System!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl animate-bounce" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-1/4 left-1/4">
          <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
        </div>
        <div className="absolute top-3/4 right-1/4">
          <Star className="h-4 w-4 text-pink-300 animate-ping" />
        </div>
        <div className="absolute top-1/3 right-1/3">
          <Zap className="h-5 w-5 text-cyan-300 animate-bounce" />
        </div>
      </div>

      <Header showAuth={false} />
      
      <div className="relative z-10 container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <div className="w-full max-w-md">
          {/* Hero section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Humansys
            </h1>
            <p className="text-purple-200 text-lg">
              O futuro da gestão de RH chegou
            </p>
          </div>

          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Acesse sua conta</CardTitle>
              <CardDescription className="text-purple-200">
                Entre ou crie sua conta para começar sua jornada
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
                  <TabsTrigger 
                    value="login" 
                    className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                  >
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                  >
                    Cadastrar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-white">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 backdrop-blur-sm focus:bg-white/20 focus:border-purple-400"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-white">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 backdrop-blur-sm focus:bg-white/20 focus:border-purple-400"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0 text-purple-300 hover:text-white hover:bg-white/10"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Entrar na Plataforma
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-white">Nome completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={signupData.name}
                          onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 backdrop-blur-sm focus:bg-white/20 focus:border-purple-400"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 backdrop-blur-sm focus:bg-white/20 focus:border-purple-400"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Crie uma senha segura"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 backdrop-blur-sm focus:bg-white/20 focus:border-purple-400"
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0 text-purple-300 hover:text-white hover:bg-white/10"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm p-4 rounded-lg border border-green-400/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-green-200">🎉 Teste Premium Grátis</span>
                      </div>
                      <div className="text-green-100 text-sm">
                        30 dias de acesso completo à plataforma mais avançada de RH do mercado!
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Crown className="mr-2 h-4 w-4" />
                      )}
                      Começar Jornada Premium
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm text-purple-200 hover:text-white transition-colors"
                >
                  Esqueceu sua senha?
                </Button>
              </div>

              {/* Features highlight */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-blue-200">IA Avançada</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-purple-200">Gamificação</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-orange-200">Analytics</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
