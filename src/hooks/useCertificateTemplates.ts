
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  template_url?: string;
  auto_fill_data: {
    fields: string[];
  };
  active: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCertificateTemplateData {
  name: string;
  description: string;
  type: string;
  template_url?: string;
  auto_fill_data?: {
    fields: string[];
  };
}

export const useCertificateTemplates = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTemplates = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('certificate_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert the data to match our interface
      const convertedData: CertificateTemplate[] = (data || []).map(item => ({
        ...item,
        auto_fill_data: typeof item.auto_fill_data === 'object' && item.auto_fill_data !== null 
          ? item.auto_fill_data as { fields: string[] }
          : { fields: ['name', 'date'] }
      }));
      
      setTemplates(convertedData);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os templates de certificados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (templateData: CreateCertificateTemplateData) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('certificate_templates')
        .insert([{
          ...templateData,
          user_id: user.id,
          auto_fill_data: templateData.auto_fill_data || { fields: ['name', 'date'] }
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Template de certificado criado com sucesso!"
      });

      fetchTemplates();
      return true;
    } catch (error) {
      console.error('Erro ao criar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o template.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<CreateCertificateTemplateData>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('certificate_templates')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Template atualizado com sucesso!"
      });

      fetchTemplates();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o template.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('certificate_templates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Template removido com sucesso!"
      });

      fetchTemplates();
      return true;
    } catch (error) {
      console.error('Erro ao remover template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o template.",
        variant: "destructive"
      });
      return false;
    }
  };

  const generateCertificate = async (templateId: string, collaboratorId: string, trainingId?: string) => {
    if (!user) return false;

    try {
      // Buscar dados do colaborador
      const { data: collaborator, error: collabError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('id', collaboratorId)
        .single();

      if (collabError) throw collabError;

      // Buscar template
      const { data: template, error: templateError } = await supabase
        .from('certificate_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Criar certificado
      const certificateData = {
        collaborator_name: collaborator.name,
        issue_date: new Date().toLocaleDateString('pt-BR'),
        template_url: template.template_url,
        training_title: trainingId ? 'Treinamento Concluído' : 'Certificado de Participação'
      };

      const { error } = await supabase
        .from('generated_certificates')
        .insert([{
          template_id: templateId,
          collaborator_id: collaboratorId,
          training_id: trainingId,
          certificate_data: certificateData,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Certificado gerado com sucesso!"
      });

      return true;
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o certificado.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    generateCertificate,
    refetch: fetchTemplates
  };
};
