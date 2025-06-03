
import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, User, FileText, Briefcase, Users, Play, Eye, MoreHorizontal } from 'lucide-react';
import { NewOnboardingDialog } from '@/components/onboarding/NewOnboardingDialog';
import { OnboardingDetails } from '@/components/onboarding/OnboardingDetails';
import { useOnboarding } from '@/hooks/useOnboarding';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OnboardingTableData {
  id: string;
  collaboratorName: string;
  position: string;
  department: string;
  status: string;
  progress: number;
  startDate: string;
  currentStep: string;
  collaborator?: {
    id: string;
    name: string;
    email: string;
  };
}

export const Onboarding = () => {
  const { processes, isLoading } = useOnboarding();
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Garantir que processes seja sempre um array válido e converter para formato da tabela
  const tableData = useMemo<OnboardingTableData[]>(() => {
    if (!Array.isArray(processes)) return [];
    
    return processes.map((process) => ({
      id: process?.id || '',
      collaboratorName: process?.collaborator?.name || 'Nome não disponível',
      position: process?.position || 'Posição não definida',
      department: process?.department || 'Departamento não definido',
      status: process?.status || 'not-started',
      progress: process?.progress || 0,
      startDate: process?.start_date || '',
      currentStep: process?.current_step || 'Não definida',
      collaborator: process?.collaborator
    }));
  }, [processes]);

  // Configuração das colunas da tabela
  const columnHelper = createColumnHelper<OnboardingTableData>();

  const columns = useMemo<ColumnDef<OnboardingTableData>[]>(() => [
    columnHelper.accessor('collaboratorName', {
      header: 'Colaborador',
      cell: (info) => (
        <div className="font-medium">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('position', {
      header: 'Cargo',
      cell: (info) => (
        <div className="text-sm text-muted-foreground">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('department', {
      header: 'Departamento',
      cell: (info) => (
        <Badge variant="outline">
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'completed': return 'bg-green-500';
            case 'in-progress': return 'bg-blue-500';
            case 'not-started': return 'bg-gray-500';
            default: return 'bg-gray-500';
          }
        };
        const getStatusText = (status: string) => {
          switch (status) {
            case 'completed': return 'Concluído';
            case 'in-progress': return 'Em Andamento';
            case 'not-started': return 'Não Iniciado';
            default: return 'Status Indefinido';
          }
        };
        return (
          <Badge className={getStatusColor(status)}>
            {getStatusText(status)}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('progress', {
      header: 'Progresso',
      cell: (info) => {
        const progress = info.getValue();
        return (
          <div className="flex items-center space-x-2">
            <Progress value={progress} className="h-2 w-20" />
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('startDate', {
      header: 'Data de Início',
      cell: (info) => {
        const date = info.getValue();
        return (
          <div className="text-sm">
            {date ? new Date(date).toLocaleDateString('pt-BR') : 'Data não disponível'}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: (info) => {
        const row = info.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetails(row)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDetails(row)}>
                <Play className="mr-2 h-4 w-4" />
                Acompanhar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Mock data para o modelo de onboarding
  const defaultSteps = [
    {
      id: '1',
      title: 'Documentação Pessoal',
      description: 'Envio de documentos pessoais e contratuais',
      type: 'document' as const,
      completed: true,
      order: 1
    },
    {
      id: '2',
      title: 'Apresentação da Empresa',
      description: 'Conhecer a história, missão e valores da empresa',
      type: 'training' as const,
      completed: true,
      order: 2
    },
    {
      id: '3',
      title: 'Reunião com Gestor',
      description: 'Primeira reunião com o gestor direto',
      type: 'meeting' as const,
      completed: true,
      dueDate: '2024-01-23',
      order: 3
    },
    {
      id: '4',
      title: 'Treinamento de Segurança',
      description: 'Curso obrigatório sobre políticas de segurança',
      type: 'training' as const,
      completed: false,
      dueDate: '2024-01-25',
      order: 4
    },
    {
      id: '5',
      title: 'Setup do Ambiente',
      description: 'Configuração de equipamentos e acessos',
      type: 'task' as const,
      completed: false,
      dueDate: '2024-01-24',
      order: 5
    },
    {
      id: '6',
      title: 'Integração com a Equipe',
      description: 'Conhecer os colegas de trabalho',
      type: 'meeting' as const,
      completed: false,
      dueDate: '2024-01-26',
      order: 6
    }
  ];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'training': return Play;
      case 'meeting': return Users;
      case 'task': return Briefcase;
      default: return FileText;
    }
  };

  const openDetails = (process: any) => {
    setSelectedProcess(process);
    setDetailsOpen(true);
  };

  // Filtros seguros para evitar erros
  const safeProcesses = Array.isArray(processes) ? processes : [];
  const inProgressProcesses = safeProcesses.filter((p) => p?.status !== 'completed');
  const completedProcesses = safeProcesses.filter((p) => p?.status === 'completed');
  const completedCount = completedProcesses.length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Onboarding</h1>
            <p className="text-muted-foreground">
              Gerencie o processo de integração de novos colaboradores
            </p>
          </div>
          <NewOnboardingDialog />
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inProgressProcesses.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedCount}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeProcesses.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {safeProcesses.length > 0 
                  ? Math.round((completedCount / safeProcesses.length) * 100)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Processos Ativos</TabsTrigger>
            <TabsTrigger value="template">Modelo de Onboarding</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Processos de Onboarding Ativos</CardTitle>
                <CardDescription>
                  Acompanhe o progresso dos colaboradores em processo de integração
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tableData.length > 0 ? (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                              <div className="text-center py-8">
                                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">Nenhum processo ativo</h3>
                                <p className="text-muted-foreground mb-4">Comece criando um novo onboarding</p>
                                <NewOnboardingDialog />
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    
                    {table.getPageCount() > 1 && (
                      <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                        >
                          Próximo
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum processo ativo</h3>
                    <p className="text-muted-foreground mb-4">Comece criando um novo onboarding</p>
                    <NewOnboardingDialog />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="template">
            <Card>
              <CardHeader>
                <CardTitle>Modelo de Onboarding Padrão</CardTitle>
                <CardDescription>
                  Configure as etapas padrão do processo de integração
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {defaultSteps.map((step, index) => {
                    const Icon = getStepIcon(step.type);
                    return (
                      <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {step.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Prazo: {new Date(step.dueDate).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {step.type === 'document' && 'Documento'}
                          {step.type === 'training' && 'Treinamento'}
                          {step.type === 'meeting' && 'Reunião'}
                          {step.type === 'task' && 'Tarefa'}
                        </Badge>
                        {step.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline">
                    Adicionar Etapa
                  </Button>
                  <Button>
                    Salvar Modelo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Processos Concluídos</CardTitle>
                <CardDescription>
                  Histórico de onboardings finalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedProcesses.length > 0 ? (
                  <div className="space-y-4">
                    {completedProcesses.map((process) => (
                      <div key={process?.id || Math.random()} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">
                            {process?.collaborator?.name || 'Nome não disponível'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {process?.position || 'Posição não definida'} • {process?.department || 'Departamento não definido'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Concluído • Iniciado em {process?.start_date ? new Date(process.start_date).toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-green-500">Concluído</Badge>
                          <Button variant="outline" size="sm" onClick={() => openDetails(process)}>
                            Ver Relatório
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum onboarding concluído</h3>
                    <p className="text-muted-foreground">Os processos concluídos aparecerão aqui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedProcess && (
          <OnboardingDetails 
            process={selectedProcess}
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
