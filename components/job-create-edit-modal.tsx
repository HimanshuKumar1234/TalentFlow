"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { JobsAPI, type Job } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { X, Plus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required").max(100, "Title too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().min(1, "Salary range is required"),
  type: z.enum(["full-time", "part-time", "contract", "remote"]),
  status: z.enum(["active", "archived"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is required"),
  qualifications: z.array(z.string()).min(1, "At least one qualification is required"),
})

type JobFormData = z.infer<typeof jobSchema>

interface JobCreateEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJobSaved: () => void
  job?: Job | null
  mode?: "create" | "edit"
}

export function JobCreateEditModal({
  open,
  onOpenChange,
  onJobSaved,
  job = null,
  mode = "create",
}: JobCreateEditModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newQualification, setNewQualification] = useState("")

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      company: "",
      location: "",
      salary: "",
      type: "full-time",
      status: "active",
      tags: [],
      responsibilities: [""],
      qualifications: [""],
    },
  })

  useEffect(() => {
    if (job && mode === "edit") {
      form.reset({
        title: job.title,
        slug: job.slug || generateSlug(job.title),
        description: job.description,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        status: job.status,
        tags: job.tags,
        responsibilities: job.responsibilities.length ? job.responsibilities : [""],
        qualifications: job.qualifications.length ? job.qualifications : [""],
      })
    } else if (mode === "create") {
      form.reset({
        title: "",
        slug: "",
        description: "",
        company: "",
        location: "",
        salary: "",
        type: "full-time",
        status: "active",
        tags: [],
        responsibilities: [""],
        qualifications: [""],
      })
    }
  }, [job, mode, form])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    form.setValue("title", title)
    if (!job || mode === "create") {
      form.setValue("slug", generateSlug(title))
    }
  }

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = form.getValues("tags")
      if (!currentTags.includes(newTag.trim())) {
        form.setValue("tags", [...currentTags, newTag.trim()])
        setNewTag("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags")
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
    )
  }

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      const current = form.getValues("responsibilities")
      form.setValue("responsibilities", [...current, newResponsibility.trim()])
      setNewResponsibility("")
    }
  }

  const removeResponsibility = (index: number) => {
    const current = form.getValues("responsibilities")
    if (current.length > 1) {
      form.setValue(
        "responsibilities",
        current.filter((_, i) => i !== index),
      )
    }
  }

  const addQualification = () => {
    if (newQualification.trim()) {
      const current = form.getValues("qualifications")
      form.setValue("qualifications", [...current, newQualification.trim()])
      setNewQualification("")
    }
  }

  const removeQualification = (index: number) => {
    const current = form.getValues("qualifications")
    if (current.length > 1) {
      form.setValue(
        "qualifications",
        current.filter((_, i) => i !== index),
      )
    }
  }

  const onSubmit = async (data: JobFormData) => {
    try {
      setLoading(true)

      const filteredData = {
        ...data,
        responsibilities: data.responsibilities.filter((r) => r.trim()),
        qualifications: data.qualifications.filter((q) => q.trim()),
      }

      if (mode === "edit" && job) {
        await JobsAPI.updateJob(job.id, filteredData)
        toast({
          title: "Success",
          description: "Job updated successfully",
        })
      } else {
        await JobsAPI.createJob(filteredData)
        toast({
          title: "Success",
          description: "Job created successfully",
        })
      }

      onJobSaved()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} job`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">{mode === "edit" ? "Edit Job" : "Create New Job"}</DialogTitle>
            <DialogDescription>
              {mode === "edit" ? "Update the job details below" : "Fill in the details to create a new job listing"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input id="slug" {...form.register("slug")} placeholder="auto-generated from title" />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" {...form.register("company")} placeholder="e.g. TechCorp" />
                {form.formState.errors.company && (
                  <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" {...form.register("location")} placeholder="e.g. San Francisco, CA" />
                {form.formState.errors.location && (
                  <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range *</Label>
                <Input id="salary" {...form.register("salary")} placeholder="e.g. $80k - $120k" />
                {form.formState.errors.salary && (
                  <p className="text-sm text-destructive">{form.formState.errors.salary.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select
                  onValueChange={(value) => form.setValue("type", value as any)}
                  defaultValue={form.watch("type")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => form.setValue("status", value as any)}
                  defaultValue={form.watch("status")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe the role and what the candidate will be doing..."
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tags *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("tags").map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
              {form.formState.errors.tags && (
                <p className="text-sm text-destructive">{form.formState.errors.tags.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Responsibilities *</Label>
              <div className="space-y-2">
                {form.watch("responsibilities").map((responsibility, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={responsibility}
                      onChange={(e) => {
                        const current = form.getValues("responsibilities")
                        current[index] = e.target.value
                        form.setValue("responsibilities", current)
                      }}
                      placeholder="Enter a responsibility"
                    />
                    {form.watch("responsibilities").length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeResponsibility(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  placeholder="Add new responsibility"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addResponsibility()
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addResponsibility}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {form.formState.errors.responsibilities && (
                <p className="text-sm text-destructive">{form.formState.errors.responsibilities.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Qualifications *</Label>
              <div className="space-y-2">
                {form.watch("qualifications").map((qualification, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={qualification}
                      onChange={(e) => {
                        const current = form.getValues("qualifications")
                        current[index] = e.target.value
                        form.setValue("qualifications", current)
                      }}
                      placeholder="Enter a qualification"
                    />
                    {form.watch("qualifications").length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeQualification(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  placeholder="Add new qualification"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addQualification()
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addQualification}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {form.formState.errors.qualifications && (
                <p className="text-sm text-destructive">{form.formState.errors.qualifications.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === "edit" ? "Updating..." : "Creating..."}
                  </>
                ) : mode === "edit" ? (
                  "Update Job"
                ) : (
                  "Create Job"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
