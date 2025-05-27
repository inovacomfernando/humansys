
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Survey, SurveyQuestion } from '@/types/surveys';
import { Plus, Trash2, GripVertical, Eye } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from '@/hooks/use-toast';

interface SurveyBuilderProps {
  survey?: Survey;
  onSave: (survey: Survey) => void;
  onPreview: (survey: Survey) => void;
}

export const SurveyBuilder: React.FC<SurveyBuilderProps> = ({
  survey,
  onSave,
  onPreview
}) => {
  const { toast } = useToast();
  
  const [editingSurvey, setEditingSurvey] = useState<Survey>(
    survey || {
      id: '',
      title: '',
      description: '',
      type: 'custom',
      status: 'draft',
      questions: [],
      target_audience: [],
      start_date: '',
      end_date: '',
      anonymous: true,
      created_by: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  );

  const questionTypes = [
    { value: 'multiple_choice', label: 'Múltipla Escolha' },
    { value: 'rating', label: 'Avaliação (Estrelas)' },
    { value: 'scale', label: 'Escala Numérica' },
    { value: 'text', label: 'Texto Livre' },
    { value: 'yes_no', label: 'Sim/Não' },
    { value: 'matrix', label: 'Matriz de Perguntas' }
  ];

  const addQuestion = (type: SurveyQuestion['type']) => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type,
      question: 'Nova pergunta',
      required: false,
      options: type === 'multiple_choice' ? ['Opção 1', 'Opção 2'] : undefined,
      scale_min: type === 'scale' ? 1 : undefined,
      scale_max: type === 'scale' ? 10 : undefined,
      scale_labels: type === 'scale' ? { min: 'Discordo totalmente', max: 'Concordo totalmente' } : undefined
    };

    setEditingSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updated_at: new Date().toISOString()
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<SurveyQuestion>) => {
    setEditingSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
      updated_at: new Date().toISOString()
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setEditingSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
      updated_at: new Date().toISOString()
    }));
  };

  const addOption = (questionId: string) => {
    const question = editingSurvey.questions.find(q => q.id === questionId);
    if (question && question.options) {
      updateQuestion(questionId, {
        options: [...question.options, `Opção ${question.options.length + 1}`]
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = editingSurvey.questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = editingSurvey.questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(editingSurvey.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setEditingSurvey(prev => ({
      ...prev,
      questions: items,
      updated_at: new Date().toISOString()
    }));
  };

  const handleSave = () => {
    if (!editingSurvey.title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para a pesquisa.",
        variant: "destructive"
      });
      return;
    }

    if (editingSurvey.questions.length === 0) {
      toast({
        title: "Perguntas obrigatórias",
        description: "A pesquisa deve ter pelo menos uma pergunta.",
        variant: "destructive"
      });
      return;
    }

    onSave(editingSurvey);
    toast({
      title: "Pesquisa salva",
      description: "Pesquisa criada com sucesso!"
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Criar Pesquisa</h2>
          <p className="text-muted-foreground">Configure perguntas e opções da pesquisa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onPreview(editingSurvey)}>
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button onClick={handleSave}>
            Salvar Pesquisa
          </Button>
        </div>
      </div>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título da Pesquisa</Label>
              <Input
                id="title"
                value={editingSurvey.title}
                onChange={(e) => setEditingSurvey(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Pesquisa de Clima Organizacional"
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo de Pesquisa</Label>
              <Select
                value={editingSurvey.type}
                onValueChange={(value: Survey['type']) =>
                  setEditingSurvey(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="climate">Clima Organizacional</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="satisfaction">Satisfação</SelectItem>
                  <SelectItem value="engagement">Engajamento</SelectItem>
                  <SelectItem value="custom">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={editingSurvey.description}
              onChange={(e) => setEditingSurvey(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o objetivo da pesquisa..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Data de Início</Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={editingSurvey.start_date}
                onChange={(e) => setEditingSurvey(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end-date">Data de Término</Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={editingSurvey.end_date}
                onChange={(e) => setEditingSurvey(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={editingSurvey.anonymous}
              onCheckedChange={(checked) => setEditingSurvey(prev => ({ ...prev, anonymous: checked }))}
            />
            <Label htmlFor="anonymous">Pesquisa anônima</Label>
          </div>
        </CardContent>
      </Card>

      {/* Perguntas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Perguntas
            <Select onValueChange={(value: SurveyQuestion['type']) => addQuestion(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Adicionar pergunta" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <Plus className="h-4 w-4 mr-2 inline" />
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {editingSurvey.questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border rounded-lg p-4 bg-white"
                        >
                          <div className="flex items-start gap-4">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">#{index + 1}</span>
                                <Input
                                  value={question.question}
                                  onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                                  className="flex-1"
                                />
                                <Switch
                                  checked={question.required}
                                  onCheckedChange={(checked) => updateQuestion(question.id, { required: checked })}
                                />
                                <Label className="text-sm">Obrigatória</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteQuestion(question.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {question.type === 'multiple_choice' && question.options && (
                                <div className="space-y-2">
                                  {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                      <Input
                                        value={option}
                                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                        placeholder={`Opção ${optionIndex + 1}`}
                                      />
                                      {question.options!.length > 2 && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeOption(question.id, optionIndex)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOption(question.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adicionar Opção
                                  </Button>
                                </div>
                              )}

                              {question.type === 'scale' && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm">Valor Mínimo</Label>
                                    <Input
                                      type="number"
                                      value={question.scale_min || 1}
                                      onChange={(e) => updateQuestion(question.id, { scale_min: Number(e.target.value) })}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm">Valor Máximo</Label>
                                    <Input
                                      type="number"
                                      value={question.scale_max || 10}
                                      onChange={(e) => updateQuestion(question.id, { scale_max: Number(e.target.value) })}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm">Rótulo Mínimo</Label>
                                    <Input
                                      value={question.scale_labels?.min || ''}
                                      onChange={(e) => updateQuestion(question.id, {
                                        scale_labels: { ...question.scale_labels, min: e.target.value, max: question.scale_labels?.max || '' }
                                      })}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm">Rótulo Máximo</Label>
                                    <Input
                                      value={question.scale_labels?.max || ''}
                                      onChange={(e) => updateQuestion(question.id, {
                                        scale_labels: { ...question.scale_labels, max: e.target.value, min: question.scale_labels?.min || '' }
                                      })}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {editingSurvey.questions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma pergunta adicionada ainda.</p>
              <p className="text-sm">Use o menu acima para adicionar perguntas.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
