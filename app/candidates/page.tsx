"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"
import { CandidatesAPI, JobsAPI, type Candidate, type Job } from "@/lib/api"
import { Search, Users, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { CandidateVirtualList } from "@/components/candidate-virtual-list"
import { CandidateKanban } from "@/components/candidate-kanban"
import { useSearchParams } from "next/navigation"

export default function CandidatesPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedJob, setSelectedJob] = useState(searchParams?.get("jobId") || "all")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")

  const stages = [
    { value: "all", label: "All Stages", count: 0 },
    { value: "applied", label: "Applied", count: 0 },
    { value: "screening", label: "Screening", count: 0 },
    { value: "interview", label: "Interview", count: 0 },
    { value: "offer", label: "Offer", count: 0 },
    { value: "hired", label: "Hired", count: 0 },
    { value: "rejected", label: "Rejected", count: 0 },
  ]

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStage = selectedStage === "all" || candidate.currentStage === selectedStage
      const matchesJob = selectedJob === "all" || candidate.jobId === selectedJob

      return matchesSearch && matchesStage && matchesJob
    })
  }, [candidates, searchTerm, selectedStage, selectedJob])

  const stagesWithCounts = useMemo(() => {
    const counts = candidates.reduce(
      (acc, candidate) => {
        acc[candidate.currentStage] = (acc[candidate.currentStage] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return stages.map((stage) => ({
      ...stage,
      count: stage.value === "all" ? candidates.length : counts[stage.value] || 0,
    }))
  }, [candidates])

  const loadData = async () => {
    try {
      setLoading(true)
      const [candidatesData, jobsData] = await Promise.all([
        CandidatesAPI.getCandidates(),
        JobsAPI.getJobs(1, 100), // Get all jobs for filter
      ])

      setCandidates(candidatesData)
      setJobs(jobsData.jobs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load candidates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStageChange = async (candidateId: string, newStage: Candidate["currentStage"]) => {
    try {
      await CandidatesAPI.updateCandidateStage(candidateId, newStage)

      // Optimistic update
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId ? { ...candidate, currentStage: newStage, updatedAt: new Date() } : candidate,
        ),
      )

      toast({
        title: "Success",
        description: "Candidate stage updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update candidate stage",
        variant: "destructive",
      })
      // Reload data on error
      loadData()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-balance mb-2">Candidate Management</h1>
            <p className="text-muted-foreground">Track and manage your recruitment pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="hover-lift"
            >
              <Users className="w-4 h-4 mr-2" />
              List View
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              onClick={() => setViewMode("kanban")}
              className="hover-lift"
            >
              <Eye className="w-4 h-4 mr-2" />
              Kanban
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search candidates by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              {stagesWithCounts.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label} ({stage.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stage Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          {stagesWithCounts.slice(1).map((stage) => (
            <Card
              key={stage.value}
              className={cn(
                "glass-effect border-border/50 hover-lift cursor-pointer transition-all",
                selectedStage === stage.value && "ring-2 ring-primary",
              )}
              onClick={() => setSelectedStage(stage.value)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{stage.count}</div>
                <div className="text-sm text-muted-foreground">{stage.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="glass-effect border-border/50 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                    <div className="w-20 h-6 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : viewMode === "list" ? (
          <CandidateVirtualList candidates={filteredCandidates} jobs={jobs} onStageChange={handleStageChange} />
        ) : (
          <CandidateKanban candidates={filteredCandidates} jobs={jobs} onStageChange={handleStageChange} />
        )}

        {!loading && filteredCandidates.length === 0 && (
          <Card className="glass-effect border-border/50">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No candidates found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedStage !== "all" || selectedJob !== "all"
                  ? "Try adjusting your filters to see more candidates."
                  : "No candidates have been added yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>


      <EnhancedCircularNavbar />
    </div>
  )
}
