"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"
import { AssessmentsAPI, JobsAPI, type Assessment, type Job } from "@/lib/api"
import { Plus, Search, Eye, Edit, Share, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"

export default function AssessmentsPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJob, setSelectedJob] = useState(searchParams?.get("jobId") || "all")

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesJob = selectedJob === "all" || assessment.jobId === selectedJob
    return matchesSearch && matchesJob
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const [assessmentsData, jobsData] = await Promise.all([AssessmentsAPI.getAssessments(), JobsAPI.getJobs(1, 100)])

      setAssessments(assessmentsData)
      setJobs(jobsData.jobs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCopyLink = async (assessment: Assessment) => {
    try {
      await navigator.clipboard.writeText(assessment.shareableLink)
      toast({
        title: "Success",
        description: "Assessment link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  const getJobTitle = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId)
    return job?.title || "Unknown Job"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-balance mb-2">Assessment Builder</h1>
            <p className="text-muted-foreground">Create and manage candidate assessments</p>
          </div>
          <Button asChild className="hover-lift">
            <Link href="/assessments/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Assessment
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger className="w-full sm:w-64">
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
        </div>

        {/* Assessments Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment) => {
              const totalQuestions = assessment.sections.reduce((sum, section) => sum + section.questions.length, 0)

              return (
                <Card key={assessment.id} className="glass-effect border-border/50 hover-lift transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-balance mb-2">{assessment.title}</CardTitle>
                        <CardDescription>{getJobTitle(assessment.jobId)}</CardDescription>
                      </div>
                      <Badge variant={assessment.isPublished ? "default" : "secondary"}>
                        {assessment.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{assessment.description}</p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{assessment.sections.length} sections</span>
                      <span>{totalQuestions} questions</span>
                      <span>Created {format(new Date(assessment.createdAt), "MMM d")}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* <Button variant="outline" size="sm" asChild className="flex-1 hover-lift bg-transparent">
                        <Link href={`/assessments/${assessment.id}/edit`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button> */}
                      <Button variant="outline" size="sm" asChild className="flex-1 hover-lift bg-transparent">
                        <Link href={`/assessments/${assessment.id}/preview`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(assessment)}
                        className="hover-lift bg-transparent"
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && filteredAssessments.length === 0 && (
          <Card className="glass-effect border-border/50">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No assessments found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedJob !== "all"
                  ? "Try adjusting your filters to see more assessments."
                  : "Create your first assessment to get started."}
              </p>
              <Button asChild className="hover-lift">
                <Link href="/assessments/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assessment
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <EnhancedCircularNavbar />
    </div>
  )
}
