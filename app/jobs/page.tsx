"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"

import { JobsAPI, type Job } from "@/lib/api"
import { Plus, Search, Filter, Archive, ArchiveRestore, GripVertical, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { JobCreateEditModal } from "@/components/job-create-edit-modal"
import { JobFilters } from "@/components/job-filters"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useToast } from "@/hooks/use-toast"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({ status: "all", tags: [] as string[] })
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  const loadJobs = async () => {
    try {
      setLoading(true)
      const response = await JobsAPI.getJobs(pagination.page, 12, {
        title: searchTerm,
        status: filters.status === "all" ? undefined : filters.status,
        tags: filters.tags,
      })
      setJobs(response.jobs)
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [pagination.page, searchTerm, filters])

  const handleArchiveToggle = async (job: Job) => {
    try {
      const newStatus = job.status === "active" ? "archived" : "active"
      await JobsAPI.updateJob(job.id, { status: newStatus })
      toast({
        title: "Success",
        description: `Job ${newStatus === "active" ? "restored" : "archived"} successfully`,
      })
      loadJobs()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      })
    }
  }

  const handleEditJob = (job: Job, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedJob(job)
    setShowEditModal(true)
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(jobs)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Optimistic update
    setJobs(items)

    try {
      const jobIds = items.map((job) => job.id)
      await JobsAPI.reorderJobs(jobIds)
      toast({
        title: "Success",
        description: "Jobs reordered successfully",
      })
    } catch (error) {
      // Rollback on failure
      loadJobs()
      toast({
        title: "Error",
        description: "Failed to reorder jobs",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-balance mb-2">Jobs Board</h1>
            <p className="text-muted-foreground">Manage your job listings and track applications</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="hover-lift">
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search jobs by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("hover-lift", showFilters && "bg-accent")}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && <JobFilters filters={filters} onFiltersChange={setFilters} />}

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-effect border-border/50 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="jobs">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {jobs.map((job, index) => (
                    <Draggable key={job.id} draggableId={job.id} index={index}>
                      {(provided, snapshot) => (
                        <Link href={`/jobs/${job.id}`}>
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "glass-effect border-border/50 hover-lift transition-all duration-300 cursor-pointer group",
                              "hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20",
                              snapshot.isDragging && "rotate-2 scale-105 shadow-2xl",
                              job.status === "archived" && "opacity-60",
                            )}
                          >
                            <CardHeader className="relative">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="group-hover:text-primary transition-colors text-balance line-clamp-2">
                                    {job.title}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {job.company} • {job.location}
                                  </CardDescription>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div {...provided.dragHandleProps} className="cursor-grab hover:text-primary p-1">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleEditJob(job, e)}
                                    className="hover-lift h-8 w-8 p-0"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleArchiveToggle(job)
                                    }}
                                    className="hover-lift h-8 w-8 p-0"
                                  >
                                    {job.status === "active" ? (
                                      <Archive className="w-4 h-4" />
                                    ) : (
                                      <ArchiveRestore className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <Badge
                                variant={job.status === "active" ? "default" : "secondary"}
                                className="absolute top-4 right-4 group-hover:scale-105 transition-transform"
                              >
                                {job.status}
                              </Badge>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {job.tags.slice(0, 3).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs group-hover:border-primary/30 transition-colors"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {job.tags.length > 3 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs group-hover:border-primary/30 transition-colors"
                                  >
                                    +{job.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{job.type}</span>
                                <span className="font-medium">{job.salary}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <JobCreateEditModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onJobSaved={loadJobs}
        mode="create"
      />
      <JobCreateEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onJobSaved={loadJobs}
        job={selectedJob}
        mode="edit"
      />
      <EnhancedCircularNavbar />
    </div>
  )
}

