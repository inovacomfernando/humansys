
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DocumentationCard } from './DocumentationCard';
import { DocumentationSearch } from './DocumentationSearch';
import { documentationData } from '@/data/documentationData';
import { Search, BookOpen, Star } from 'lucide-react';

export const FounderDocumentationTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredDocuments = documentationData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.some(item => 
                           item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(documentationData.map(doc => doc.category))];

  const toggleFavorite = (docId: string) => {
    setFavorites(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Central de Documentação Empresarial
          </CardTitle>
          <CardDescription>
            Manuais, estratégias e recursos para maximizar o sucesso do seu negócio
          </CardDescription>
        </CardHeader>
      </Card>

      <DocumentationSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((doc) => (
          <DocumentationCard
            key={doc.id}
            document={doc}
            isFavorite={favorites.includes(doc.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="p-8 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum documento encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os termos de busca ou filtros
          </p>
        </Card>
      )}
    </div>
  );
};
