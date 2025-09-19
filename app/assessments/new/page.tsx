"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"

import { AssessmentsAPI, JobsAPI, type Job, type AssessmentSection } from "@/lib/api"
import { ArrowLeft, Plus, Save, Eye, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { AssessmentBuilder } from "@/components/assessment-builder"
import { AssessmentPreview } from "@/components/assessment-preview"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

export default function NewAssessmentPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jobId: "",
    sections: [] as AssessmentSection[],
  })

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobsData = await JobsAPI.getJobs(1, 100)
        setJobs(jobsData.jobs)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load jobs",
          variant: "destructive",
        })
      }
    }

    loadJobs()
  }, [])

  const handleSave = async (publish = false) => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Assessment title is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.jobId) {
      toast({
        title: "Validation Error",
        description: "Please select a job for this assessment",
        variant: "destructive",
      })
      return
    }

    if (formData.sections.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one section",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await AssessmentsAPI.createAssessment({
        ...formData,
        isPublished: publish,
      })

      toast({
        title: "Success",
        description: `Assessment ${publish ? "published" : "saved"} successfully`,
      })

      router.push("/assessments")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addSection = () => {
    const newSection: AssessmentSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      description: "",
      questions: [],
      order: formData.sections.length,
    }

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))
  }

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === sectionId ? { ...section, ...updates } : section)),
    }))
  }

  const deleteSection = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
  }

  const handleSectionDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(formData.sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order values
    const updatedSections = items.map((section, index) => ({
      ...section,
      order: index,
    }))

    setFormData((prev) => ({
      ...prev,
      sections: updatedSections,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild className="hover-lift">
            <Link href="/assessments">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessments
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-balance mb-2">Create Assessment</h1>
            <p className="text-muted-foreground">Build a comprehensive evaluation for your candidates</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode ? "default" : "outline"}
              onClick={() => setPreviewMode(!previewMode)}
              className="hover-lift"
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? "Edit Mode" : "Preview"}
            </Button>
            <Button variant="outline" onClick={() => handleSave(false)} disabled={loading} className="hover-lift">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={loading} className="hover-lift">
              {loading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        {previewMode ? (
          <AssessmentPreview title={formData.title} description={formData.description} sections={formData.sections} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assessment Details */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle>Assessment Details</CardTitle>
                  <CardDescription>Basic information about your assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Frontend Developer Assessment"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job">Job Position *</Label>
                    <Select
                      value={formData.jobId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, jobId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this assessment evaluates..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle>Assessment Structure</CardTitle>
                  <CardDescription>Overview of your sections and questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.sections.map((section) => (
                      <div key={section.id} className="p-3 rounded-lg bg-card/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{section.title}</p>
                            <p className="text-xs text-muted-foreground">{section.questions.length} questions</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSection(section.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {formData.sections.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No sections added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assessment Builder */}
            <div className="lg:col-span-2">
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Assessment Builder</CardTitle>
                      <CardDescription>Add sections and questions to your assessment</CardDescription>
                    </div>
                    <Button onClick={addSection} className="hover-lift">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {formData.sections.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No sections yet</h3>
                      <p className="text-muted-foreground mb-4">Start building your assessment by adding a section</p>
                      <Button onClick={addSection} className="hover-lift">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Section
                      </Button>
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={handleSectionDragEnd}>
                      <Droppable droppableId="sections">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                            {formData.sections.map((section, index) => (
                              <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={cn(
                                      "transition-all duration-200",
                                      snapshot.isDragging && "rotate-1 scale-105 shadow-2xl",
                                    )}
                                  >
                                    <AssessmentBuilder
                                      section={section}
                                      onUpdate={(updates) => updateSection(section.id, updates)}
                                      onDelete={() => deleteSection(section.id)}
                                      dragHandleProps={provided.dragHandleProps}
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

                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <EnhancedCircularNavbar />
    </div>
  )
}

