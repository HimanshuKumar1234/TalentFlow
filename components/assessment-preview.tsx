"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { AssessmentSection } from "@/lib/api"
import { CheckCircle, Clock, FileText, Upload } from "lucide-react"

interface AssessmentPreviewProps {
  title: string
  description: string
  sections: AssessmentSection[]
  isPublicView?: boolean
}

export function AssessmentPreview({ title, description, sections, isPublicView = false }: AssessmentPreviewProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0)
  const answeredQuestions = Object.keys(responses).length
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  const updateResponse = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const shouldShowQuestion = (question: any) => {
    if (!question.conditionalLogic?.dependsOn) return true

    const dependentAnswer = responses[question.conditionalLogic.dependsOn]
    return dependentAnswer === question.conditionalLogic.showWhen
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const currentSectionData = sections[currentSection]

  if (isSubmitted) {
    return (
      <Card className="glass-effect border-border/50 max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Assessment Completed!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for completing the assessment. Your responses have been submitted successfully.
          </p>
          <div className="bg-card/50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Questions Answered:</span>
              <Badge variant="outline">
                {answeredQuestions} / {totalQuestions}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-3xl text-balance">{title}</CardTitle>
          {description && <CardDescription className="text-lg">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {sections.length} sections
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {totalQuestions} questions
              </div>
            </div>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Section Navigation */}
      {sections.length > 1 && (
        <Card className="glass-effect border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {sections.map((section, index) => (
                <Button
                  key={section.id}
                  variant={index === currentSection ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSection(index)}
                  className="whitespace-nowrap hover-lift"
                >
                  {index + 1}. {section.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Section */}
      {currentSectionData && (
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                {currentSection + 1}
              </span>
              {currentSectionData.title}
            </CardTitle>
            {currentSectionData.description && <CardDescription>{currentSectionData.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSectionData.questions.filter(shouldShowQuestion).map((question, questionIndex) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <span className="text-muted-foreground">{questionIndex + 1}.</span>
                  {question.question}
                  {question.required && <span className="text-destructive">*</span>}
                </Label>

                {/* {question.type === "single-choice" && (
                  <RadioGroup
                    value={responses[question.id] || ""}
                    onValueChange={(value) => updateResponse(question.id, value)}
                  >
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                        <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "multi-choice" && (
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question.id}-${optionIndex}`}
                          checked={(responses[question.id] || []).includes(option)}
                          onCheckedChange={(checked) => {
                            const currentValues = responses[question.id] || []
                            const newValues = checked
                              ? [...currentValues, option]
                              : currentValues.filter((v: string) => v !== option)
                            updateResponse(question.id, newValues)
                          }}
                        />
                        <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                )} */}

                {question.type === "single-choice" && (
                  <RadioGroup
                    value={responses[question.id] || ""}
                    onValueChange={(value) => updateResponse(question.id, value)}
                  >
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`${question.id}-${optionIndex}`}
                          className="text-blue-600 border-blue-600 
                                    data-[state=checked]:bg-blue-600 
                                    data-[state=checked]:text-white"
                        />
                        <Label
                          htmlFor={`${question.id}-${optionIndex}`}
                          className="text-blue-800 dark:text-blue-300 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "multi-choice" && (
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question.id}-${optionIndex}`}
                          checked={(responses[question.id] || []).includes(option)}
                          onCheckedChange={(checked) => {
                            const currentValues = responses[question.id] || []
                            const newValues = checked
                              ? [...currentValues, option]
                              : currentValues.filter((v: string) => v !== option)
                            updateResponse(question.id, newValues)
                          }}
                          className="text-blue-600 border-blue-600 
                                    data-[state=checked]:bg-blue-600 
                                    data-[state=checked]:text-white"
                        />
                        <Label
                          htmlFor={`${question.id}-${optionIndex}`}
                          className="text-blue-800 dark:text-blue-300 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}


                {question.type === "short-text" && (
                  <Input
                    value={responses[question.id] || ""}
                    onChange={(e) => updateResponse(question.id, e.target.value)}
                    placeholder="Enter your answer..."
                    maxLength={question.validation?.maxLength}
                  />
                )}

                {question.type === "long-text" && (
                  <Textarea
                    value={responses[question.id] || ""}
                    onChange={(e) => updateResponse(question.id, e.target.value)}
                    placeholder="Enter your detailed answer..."
                    rows={4}
                    maxLength={question.validation?.maxLength}
                  />
                )}

                {question.type === "numeric" && (
                  <Input
                    type="number"
                    value={responses[question.id] || ""}
                    onChange={(e) => updateResponse(question.id, e.target.value)}
                    placeholder="Enter a number..."
                    min={question.validation?.min}
                    max={question.validation?.max}
                  />
                )}

                {question.type === "file-upload" && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                )}

                {/* Validation hints */}
                {question.validation && (
                  <div className="text-xs text-muted-foreground">
                    {question.validation.minLength && (
                      <span>Min length: {question.validation.minLength} characters. </span>
                    )}
                    {question.validation.maxLength && (
                      <span>Max length: {question.validation.maxLength} characters. </span>
                    )}
                    {question.validation.min !== undefined && <span>Min value: {question.validation.min}. </span>}
                    {question.validation.max !== undefined && <span>Max value: {question.validation.max}. </span>}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="hover-lift"
        >
          Previous Section
        </Button>

        <div className="text-sm text-muted-foreground">
          Section {currentSection + 1} of {sections.length}
        </div>

        {currentSection === sections.length - 1 ? (
          <Button onClick={handleSubmit} className="hover-lift">
            Submit Assessment
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
            className="hover-lift"
          >
            Next Section
          </Button>
        )}
      </div>
    </div>
  )
}
