"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { AssessmentSection, Question } from "@/lib/api"
import { Plus, Trash2, GripVertical, X, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface AssessmentBuilderProps {
  section: AssessmentSection
  onUpdate: (updates: Partial<AssessmentSection>) => void
  onDelete: () => void
  dragHandleProps?: any
}

export function AssessmentBuilder({ section, onUpdate, onDelete, dragHandleProps }: AssessmentBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type: "single-choice",
      question: "New Question",
      required: false,
      options: ["Option 1", "Option 2"],
      order: section.questions.length,
    }

    onUpdate({
      questions: [...section.questions, newQuestion],
    })
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    onUpdate({
      questions: section.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
    })
  }

  const deleteQuestion = (questionId: string) => {
    onUpdate({
      questions: section.questions.filter((q) => q.id !== questionId),
    })
  }

  const handleQuestionDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(section.questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedQuestions = items.map((question, index) => ({
      ...question,
      order: index,
    }))

    onUpdate({ questions: updatedQuestions })
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div {...dragHandleProps} className="cursor-grab hover:text-primary">
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <Input
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="font-semibold text-lg border-none bg-transparent p-0 h-auto focus-visible:ring-0"
              placeholder="Section Title"
            />
            <Textarea
              value={section.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Section description (optional)"
              className="mt-2 border-none bg-transparent p-0 resize-none focus-visible:ring-0"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="hover-lift">
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover-lift"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {section.questions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">No questions in this section</p>
                <Button onClick={addQuestion} size="sm" className="hover-lift">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            ) : (
              <>
                <DragDropContext onDragEnd={handleQuestionDragEnd}>
                  <Droppable droppableId={`section-${section.id}`}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {section.questions.map((question, index) => (
                          <Draggable key={question.id} draggableId={question.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={cn(
                                  "transition-all duration-200",
                                  snapshot.isDragging && "rotate-1 scale-105 shadow-xl",
                                )}
                              >
                                <QuestionBuilder
                                  question={question}
                                  onUpdate={(updates) => updateQuestion(question.id, updates)}
                                  onDelete={() => deleteQuestion(question.id)}
                                  dragHandleProps={provided.dragHandleProps}
                                  allQuestions={section.questions}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <Button onClick={addQuestion} variant="outline" className="w-full hover-lift bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

interface QuestionBuilderProps {
  question: Question
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  dragHandleProps?: any
  allQuestions: Question[]
}

function QuestionBuilder({ question, onUpdate, onDelete, dragHandleProps, allQuestions }: QuestionBuilderProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const addOption = () => {
    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`]
    onUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index) || []
    onUpdate({ options: newOptions })
  }

  const needsOptions = ["single-choice", "multi-choice"].includes(question.type)

  return (
    <Card className="bg-card/50 border-border/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div {...dragHandleProps} className="cursor-grab hover:text-primary mt-2">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Select value={question.type} onValueChange={(value: Question["type"]) => onUpdate({ type: value })}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-choice">Single Choice</SelectItem>
                  <SelectItem value="multi-choice">Multi Choice</SelectItem>
                  <SelectItem value="short-text">Short Text</SelectItem>
                  <SelectItem value="long-text">Long Text</SelectItem>
                  <SelectItem value="numeric">Numeric</SelectItem>
                  <SelectItem value="file-upload">File Upload</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${question.id}`}
                  checked={question.required}
                  onCheckedChange={(checked) => onUpdate({ required: !!checked })}
                />
                <Label htmlFor={`required-${question.id}`} className="text-sm">
                  Required
                </Label>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="hover-lift">
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            <Textarea
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              placeholder="Enter your question..."
              rows={2}
            />

            {needsOptions && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Answer Options</Label>
                {question.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {(question.options?.length || 0) > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button onClick={addOption} variant="outline" size="sm" className="hover-lift bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
            )}

            {showAdvanced && (
              <div className="space-y-3 p-3 rounded-lg bg-muted/20">
                <Label className="text-sm font-medium">Advanced Settings</Label>

                {/* Validation Rules */}
                {question.type === "short-text" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Min Length</Label>
                      <Input
                        type="number"
                        value={question.validation?.minLength || ""}
                        onChange={(e) =>
                          onUpdate({
                            validation: {
                              ...question.validation,
                              minLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Max Length</Label>
                      <Input
                        type="number"
                        value={question.validation?.maxLength || ""}
                        onChange={(e) =>
                          onUpdate({
                            validation: {
                              ...question.validation,
                              maxLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                        placeholder="100"
                      />
                    </div>
                  </div>
                )}

                {question.type === "numeric" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Min Value</Label>
                      <Input
                        type="number"
                        value={question.validation?.min || ""}
                        onChange={(e) =>
                          onUpdate({
                            validation: {
                              ...question.validation,
                              min: e.target.value ? Number.parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Max Value</Label>
                      <Input
                        type="number"
                        value={question.validation?.max || ""}
                        onChange={(e) =>
                          onUpdate({
                            validation: {
                              ...question.validation,
                              max: e.target.value ? Number.parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                        placeholder="100"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Logic */}
                <div>
                  <Label className="text-xs">Show this question only if:</Label>
                  <Select
                    value={question.conditionalLogic?.dependsOn || "default"}
                    onValueChange={(value) =>
                      onUpdate({
                        conditionalLogic: value
                          ? {
                              dependsOn: value,
                              showWhen: "Yes",
                            }
                          : undefined,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a question" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">No condition</SelectItem>
                      {allQuestions
                        .filter((q) => q.id !== question.id)
                        .map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.question.slice(0, 50)}...
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {question.conditionalLogic?.dependsOn && (
                    <Input
                      className="mt-2"
                      value={question.conditionalLogic.showWhen as string}
                      onChange={(e) =>
                        onUpdate({
                          conditionalLogic: {
                            ...question.conditionalLogic!,
                            showWhen: e.target.value,
                          },
                        })
                      }
                      placeholder="Answer value to show this question"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover-lift"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
