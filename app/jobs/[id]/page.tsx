"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"

import { JobsAPI, CandidatesAPI, type Job, type Candidate } from "@/lib/api"
import {
  ArrowLeft,
  Edit,
  Archive,
  ArchiveRestore,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { JobCreateEditModal } from "@/components/job-create-edit-modal"
import { Timeline, type TimelineEvent } from "@/components/timeline"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])

  const jobId = params.id as string

  const loadJobDetails = async () => {
    try {
      setLoading(true)
      const [jobData, candidatesData] = await Promise.all([
        JobsAPI.getJob(jobId),
        CandidatesAPI.getCandidates({ jobId }),
      ])

      if (!jobData) {
        toast({
          title: "Error",
          description: "Job not found",
          variant: "destructive",
        })
        router.push("/jobs")
        return
      }

      setJob(jobData)
      setCandidates(candidatesData)

      const events: TimelineEvent[] = [
        {
          id: `job-created-${jobData.id}`,
          type: "job_created",
          title: "Job Created",
          description: `${jobData.title} position was created`,
          timestamp: jobData.createdAt,
        },
      ]

      if (jobData.updatedAt && jobData.updatedAt !== jobData.createdAt) {
        events.push({
          id: `job-updated-${jobData.id}`,
          type: "job_updated",
          title: "Job Updated",
          description: "Job details were modified",
          timestamp: jobData.updatedAt,
        })
      }

      // Add candidate events
      candidatesData.forEach((candidate) => {
        events.push({
          id: `candidate-applied-${candidate.id}`,
          type: "candidate_applied",
          title: "New Application",
          timestamp: candidate.appliedAt,
          metadata: {
            candidateName: candidate.name,
          },
        })

        // Add stage change events (mock data for demo)
        if (candidate.currentStage !== "applied") {
          events.push({
            id: `stage-change-${candidate.id}`,
            type: "candidate_stage_changed",
            title: "Stage Changed",
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            metadata: {
              candidateName: candidate.name,
              fromStage: "applied",
              toStage: candidate.currentStage,
            },
          })
        }
      })

      // Sort events by timestamp (newest first)
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setTimelineEvents(events)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobDetails()
  }, [jobId])

  const handleArchiveToggle = async () => {
    if (!job) return

    try {
      const newStatus = job.status === "active" ? "archived" : "active"
      const updatedJob = await JobsAPI.updateJob(job.id, { status: newStatus })
      if (updatedJob) {
        setJob(updatedJob)
        toast({
          title: "Success",
          description: `Job ${newStatus === "active" ? "restored" : "archived"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded" />
                <div className="h-48 bg-muted rounded" />
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-muted rounded" />
                <div className="h-48 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) return null

  const candidatesByStage = candidates.reduce(
    (acc, candidate) => {
      acc[candidate.currentStage] = (acc[candidate.currentStage] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const jobAge = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const recentApplications = candidates.filter(
    (c) => Date.now() - new Date(c.appliedAt).getTime() < 7 * 24 * 60 * 60 * 1000,
  ).length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild className="hover-lift">
            <Link href="/jobs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl text-balance mb-2">{job.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {job.company} • {job.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={job.status === "active" ? "default" : "secondary"} className="text-sm">
                      {job.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover-lift bg-transparent"
                      onClick={() => setShowEditModal(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleArchiveToggle}
                      className="hover-lift bg-transparent"
                    >
                      {job.status === "active" ? (
                        <>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </>
                      ) : (
                        <>
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Restore
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{candidates.length} applicants</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Job Timeline & Metrics */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Job Timeline & Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">{jobAge}</div>
                    <div className="text-sm text-muted-foreground">Days Active</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{recentApplications}</div>
                    <div className="text-sm text-muted-foreground">This Week</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-full mx-auto mb-2">
                      <Eye className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{Math.floor(candidates.length * 1.5)}</div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <h4 className="font-semibold mb-4">Recent Activity</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Job created</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {job.updatedAt && new Date(job.updatedAt).getTime() !== new Date(job.createdAt).getTime() && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Job updated</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(job.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {candidates.slice(0, 3).map((candidate) => (
                      <div key={candidate.id} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">New application from {candidate.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(candidate.appliedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Timeline Section */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Track all job-related activities and candidate progress</CardDescription>
              </CardHeader>
              <CardContent>
                {timelineEvents.length > 0 ? (
                  <Timeline events={timelineEvents} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No activity yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Required Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.qualifications.map((qualification, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{qualification}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Application Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(candidatesByStage).map(([stage, count]) => (
                    <div key={stage} className="flex items-center justify-between">
                      <span className="text-sm capitalize text-muted-foreground">{stage.replace("_", " ")}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                  {Object.keys(candidatesByStage).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No applications yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Candidates */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {candidates.slice(0, 5).map((candidate) => (
                    <Link key={candidate.id} href={`/candidates/${candidate.id}`}>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 hover:bg-card/80 transition-colors cursor-pointer">
                        <div>
                          <p className="text-sm font-medium">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {candidate.currentStage}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                  {candidates.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No applications yet</p>
                  )}
                  {candidates.length > 5 && (
                    <Button variant="outline" size="sm" className="w-full hover-lift bg-transparent" asChild>
                      <Link href={`/candidates?jobId=${job.id}`}>View All Applications</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full hover-lift" asChild>
                    <Link href={`/candidates?jobId=${job.id}`}>View Candidates</Link>
                  </Button>
                  <Button variant="outline" className="w-full hover-lift bg-transparent" asChild>
                    <Link href={`/assessments?jobId=${job.id}`}>Create Assessment</Link>
                  </Button>
                  <Button variant="outline" className="w-full hover-lift bg-transparent">
                    Share Job Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <JobCreateEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onJobSaved={loadJobDetails}
        job={job}
        mode="edit"
      />

      <EnhancedCircularNavbar />
    </div>
  )
}
