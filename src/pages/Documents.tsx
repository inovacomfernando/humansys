
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  BarChart3,
  Search,
  Plus
} from 'lucide-react';
import { NewDocumentDialog } from '@/components/documents/NewDocumentDialog';
import { DocumentEditDialog } from '@/components/documents/DocumentEditDialog';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { DocumentAnalytics } from '@/components/documents/DocumentAnalytics';
import { SmartSearch } from '@/components/documents/SmartSearch';
import { useDocuments, Document } from '@/hooks/useDocuments';

export const Documents = () => {
  const { documents, incrementDownloadCount, deleteDocument } = useDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Atualizar documentos filtrados quando documents mudar
  React.useEffect(() => {
    setFilteredDocuments(documents);
  }, [documents]);

  const handleDownload = (document: Document) => {
    incrementDownloadCount(document.id);
    // Implementar lógica de download
  };

  const handleDelete = async (documentId: string) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      await deleteDocument(documentId);
    }
  };

  const handlePreview = (document: Document) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
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
            <h1 className="text-3xl font-bold">Central de Documentos</h1>
            <p className="text-muted-foreground">
              Sistema inteligente de gestão documental com busca avançada e analytics
            </p>
          </div>
          <NewDocumentDialog />
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Busca inteligente */}
            <SmartSearch
              documents={documents}
              onFilter={setFilteredDocuments}
              onSearch={() => {}}
            />

            {/* Lista de documentos */}
            <div className="grid gap-4">
              {filteredDocuments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    {documents.length === 0 ? (
                      <>
                        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Nenhum documento criado</h3>
                        <p className="text-muted-foreground text-center mb-6">
                          Crie seu primeiro documento para começar a organizar sua biblioteca.
                        </p>
                        <NewDocumentDialog />
                      </>
                    ) : (
                      <>
                        <Search className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Nenhum documento encontrado</h3>
                        <p className="text-muted-foreground text-center">
                          Tente ajustar os filtros ou termos de busca.
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredDocuments.map((document) => (
                  <Card key={document.id} className="hover:shadow-lg transition-shadow">
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePreview(document)}
                          >
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
          </TabsContent>

          <TabsContent value="analytics">
            <DocumentAnalytics documents={documents} />
          </TabsContent>
        </Tabs>

        {/* Modal de preview */}
        <DocumentPreview
          document={previewDocument}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={handleDownload}
        />
      </div>
    </DashboardLayout>
  );
};
