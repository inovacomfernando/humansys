
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  version: string;
  file_url?: string;
  file_size?: number;
  pages?: number;
  access_level: 'all' | 'managers' | 'admin';
  download_count: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentData {
  title: string;
  description?: string;
  category: string;
  version?: string;
  file_url?: string;
  file_size?: number;
  pages?: number;
  access_level?: 'all' | 'managers' | 'admin';
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os documentos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async (documentData: CreateDocumentData) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('documents')
        .insert([{
          ...documentData,
          user_id: user.id,
          version: documentData.version || '1.0',
          access_level: documentData.access_level || 'all'
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Documento criado com sucesso!"
      });

      fetchDocuments();
      return true;
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o documento.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateDocument = async (id: string, updates: Partial<CreateDocumentData>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Documento atualizado com sucesso!"
      });

      fetchDocuments();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o documento.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteDocument = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Documento removido com sucesso!"
      });

      fetchDocuments();
      return true;
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o documento.",
        variant: "destructive"
      });
      return false;
    }
  };

  const incrementDownloadCount = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('documents')
        .update({ download_count: supabase.raw('download_count + 1') })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchDocuments();
    } catch (error) {
      console.error('Erro ao incrementar contador de downloads:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  return {
    documents,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    incrementDownloadCount,
    refetch: fetchDocuments
  };
};
