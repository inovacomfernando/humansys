
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award, Heart } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Sobre a Humansys</h1>
            <p className="text-xl text-muted-foreground">
              Transformando a gestão de RH com inteligência artificial e inovação
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Nossa Missão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Empoderar empresas com tecnologia de ponta para criar ambientes de trabalho 
                  mais humanos, eficientes e engajadores através de soluções de RH inteligentes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Nossos Valores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Inovação, transparência, excelência no atendimento e foco no desenvolvimento 
                  humano são os pilares que guiam todas as nossas decisões e produtos.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Por que escolher a Humansys?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Experiência</h3>
              <p className="text-muted-foreground">
                Mais de 10 anos desenvolvendo soluções de RH para empresas de todos os tamanhos
              </p>
            </div>

            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reconhecimento</h3>
              <p className="text-muted-foreground">
                Premiados como melhor plataforma de RH em 2023 pela TechReview Brasil
              </p>
            </div>

            <div className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Resultados</h3>
              <p className="text-muted-foreground">
                Mais de 500 empresas transformaram seu RH e reduziram turnover em até 60%
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Nossa História</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Fundada em 2014, a Humansys nasceu da necessidade de humanizar os processos de RH 
                através da tecnologia. Começamos como uma pequena startup focada em melhorar a 
                experiência do colaborador e hoje somos referência nacional em soluções de gestão 
                de pessoas com IA. Nossa jornada é marcada pela inovação constante e pelo compromisso 
                de criar workplaces mais felizes e produtivos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
