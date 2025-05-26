
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Download, Eye, Search, Folder, Trash2 } from 'lucide-react';
import { NewDocumentDialog } from '@/components/documents/NewDocumentDialog';
import { DocumentEditDialog } from '@/components/documents/DocumentEditDialog';
import { useDocuments } from '@/hooks/useDocuments';

export const Documents = () => {
  const { documents, incrementDownloadCount, deleteDocument } = useDocuments();

  const handleDownload = (document: any) => {
    incrementDownloadCount(document.id);
    // Implementar lógica de download
  };

  const handleDelete = async (documentId: string) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      await deleteDocument(documentId);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'policies': 'bg-blue-500',
      'procedures': 'bg-green-500', 
      'forms': 'bg-purple-500',
      'general': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'policies': 'Políticas',
      'procedures': 'Procedimentos',
      'forms': 'Formulários',
      'general': 'Geral'
    };
    return labels[category] || 'Geral';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Documentos</h1>
            <p className="text-muted-foreground">
              Biblioteca central de documentos e políticas da empresa
            </p>
          </div>
          <NewDocumentDialog />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar documentos..." className="pl-8" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(documents.map(d => d.category)).size}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads Total</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.reduce((total, doc) => total + doc.download_count, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atualizados</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter(d => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(d.updated_at) > weekAgo;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          {documents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum documento criado</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Crie seu primeiro documento para começar a organizar sua biblioteca.
                </p>
                <NewDocumentDialog />
              </CardContent>
            </Card>
          ) : (
            documents.map((document) => (
              <Card key={document.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getCategoryColor(document.category)}`}>
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{document.title}</CardTitle>
                        <CardDescription>
                          Versão {document.version} • Atualizado em {new Date(document.updated_at).toLocaleDateString('pt-BR')}
                          {document.pages && ` • ${document.pages} páginas`}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge>{getCategoryLabel(document.category)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {document.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {document.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Acesso: {document.access_level === 'all' ? 'Todos os colaboradores' : 
                               document.access_level === 'managers' ? 'Apenas gestores' : 'Apenas administradores'} • {document.download_count} downloads
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                      <Button size="sm" onClick={() => handleDownload(document)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <DocumentEditDialog document={document} />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(document.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
