
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  Tag, 
  FileText,
  Clock,
  SortAsc,
  SortDesc
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Document } from '@/hooks/useDocuments';

interface SearchFilters {
  category: string;
  accessLevel: string;
  dateRange: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SmartSearchProps {
  documents: Document[];
  onFilter: (filteredDocuments: Document[]) => void;
  onSearch: (query: string) => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  documents,
  onFilter,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    accessLevel: 'all',
    dateRange: 'all',
    sortBy: 'updated_at',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Função para filtrar documentos
  const filterDocuments = (query: string, currentFilters: SearchFilters) => {
    let filtered = [...documents];

    // Filtro por busca textual
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      filtered = filtered.filter(doc => 
        searchTerms.every(term =>
          doc.title.toLowerCase().includes(term) ||
          (doc.description && doc.description.toLowerCase().includes(term)) ||
          doc.category.toLowerCase().includes(term)
        )
      );
    }

    // Filtro por categoria
    if (currentFilters.category !== 'all') {
      filtered = filtered.filter(doc => doc.category === currentFilters.category);
    }

    // Filtro por nível de acesso
    if (currentFilters.accessLevel !== 'all') {
      filtered = filtered.filter(doc => doc.access_level === currentFilters.accessLevel);
    }

    // Filtro por data
    if (currentFilters.dateRange !== 'all') {
      const now = new Date();
      let dateThreshold = new Date();

      switch (currentFilters.dateRange) {
        case 'week':
          dateThreshold.setDate(now.getDate() - 7);
          break;
        case 'month':
          dateThreshold.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          dateThreshold.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          dateThreshold.setFullYear(now.getFullYear() - 1);
          break;
      }

      if (currentFilters.dateRange !== 'all') {
        filtered = filtered.filter(doc => 
          new Date(doc.updated_at) >= dateThreshold
        );
      }
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (currentFilters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'download_count':
          aValue = a.download_count;
          bValue = b.download_count;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
      }

      if (currentFilters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Aplicar filtros quando mudarem
  useEffect(() => {
    const filtered = filterDocuments(searchQuery, filters);
    onFilter(filtered);
  }, [searchQuery, filters, documents]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      accessLevel: 'all',
      dateRange: 'all',
      sortBy: 'updated_at',
      sortOrder: 'desc'
    });
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== 'all' && value !== 'updated_at' && value !== 'desc').length;

  return (
    <div className="space-y-4">
      {/* Barra de busca principal */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, descrição ou categoria..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros Avançados</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Categoria</label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="policies">Políticas</SelectItem>
                      <SelectItem value="procedures">Procedimentos</SelectItem>
                      <SelectItem value="forms">Formulários</SelectItem>
                      <SelectItem value="general">Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Nível de Acesso</label>
                  <Select value={filters.accessLevel} onValueChange={(value) => handleFilterChange('accessLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="all">Todos os colaboradores</SelectItem>
                      <SelectItem value="managers">Apenas gestores</SelectItem>
                      <SelectItem value="admin">Apenas administradores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Período</label>
                  <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todo período</SelectItem>
                      <SelectItem value="week">Última semana</SelectItem>
                      <SelectItem value="month">Último mês</SelectItem>
                      <SelectItem value="quarter">Último trimestre</SelectItem>
                      <SelectItem value="year">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Ordenar por</label>
                  <div className="flex space-x-2">
                    <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="updated_at">Data de atualização</SelectItem>
                        <SelectItem value="created_at">Data de criação</SelectItem>
                        <SelectItem value="title">Título</SelectItem>
                        <SelectItem value="download_count">Downloads</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Tags de filtros ativos */}
      {(searchQuery || activeFiltersCount > 0) && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  <Search className="h-3 w-3" />
                  "{searchQuery}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearchChange('')} />
                </Badge>
              )}
              
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {filters.category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('category', 'all')} />
                </Badge>
              )}
              
              {filters.dateRange !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {filters.dateRange}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('dateRange', 'all')} />
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                Limpar todos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
