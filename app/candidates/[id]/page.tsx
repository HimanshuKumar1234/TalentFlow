"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"

import { CandidatesAPI, JobsAPI, type Candidate, type Job } from "@/lib/api"
import { ArrowLeft, Mail, Phone, Calendar, MessageSquare, Award, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)

  const candidateId = params.id as string

  useEffect(() => {
    const loadCandidateDetails = async () => {
      try {
        setLoading(true)
        const candidateData = await CandidatesAPI.getCandidate(candidateId)

        if (!candidateData) {
          toast({
            title: "Error",
            description: "Candidate not found",
            variant: "destructive",
          })
          router.push("/candidates")
          return
        }

        const jobData = await JobsAPI.getJob(candidateData.jobId)

        setCandidate(candidateData)
        setJob(jobData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load candidate details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCandidateDetails()
  }, [candidateId])

  const handleStageChange = async (newStage: Candidate["currentStage"]) => {
    if (!candidate) return

    try {
      const updatedCandidate = await CandidatesAPI.updateCandidateStage(candidate.id, newStage)
      if (updatedCandidate) {
        setCandidate(updatedCandidate)
        toast({
          title: "Success",
          description: "Candidate stage updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update candidate stage",
        variant: "destructive",
      })
    }
  }

  const handleAddNote = async () => {
    if (!candidate || !newNote.trim()) return

    try {
      setAddingNote(true)
      // In a real app, this would be an API call
      const note = {
        id: `note-${Date.now()}`,
        content: newNote,
        mentions: [], // Extract @mentions from content
        createdAt: new Date(),
        createdBy: "Current User",
      }

      const updatedCandidate = {
        ...candidate,
        notes: [...candidate.notes, note],
        updatedAt: new Date(),
      }

      setCandidate(updatedCandidate)
      setNewNote("")

      toast({
        title: "Success",
        description: "Note added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      })
    } finally {
      setAddingNote(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
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

  if (!candidate) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStageColor = (stage: string) => {
    const colors = {
      applied: "bg-blue-500",
      screening: "bg-yellow-500",
      interview: "bg-purple-500",
      offer: "bg-green-500",
      hired: "bg-emerald-500",
      rejected: "bg-red-500",
    }
    return colors[stage as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild className="hover-lift">
            <Link href="/candidates">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Candidates
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Header */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-lg font-semibold">{getInitials(candidate.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-balance mb-2">{candidate.name}</CardTitle>
                    <CardDescription className="text-base mb-3">
                      Applied for {job?.title || "Unknown Position"}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {candidate.email}
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {candidate.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Applied {format(new Date(candidate.appliedAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={cn("text-white", getStageColor(candidate.currentStage))}>
                      {candidate.currentStage.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Select value={candidate.currentStage} onValueChange={handleStageChange}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="screening">Screening</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Timeline */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full mt-2 flex-shrink-0",
                          index === 0 ? "bg-primary" : "bg-muted",
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.createdAt), "MMM d, yyyy • h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Notes & Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  {candidate.notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-lg bg-card/50">
                      <p className="text-sm mb-2">{note.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {note.createdBy}</span>
                        <span>{format(new Date(note.createdAt), "MMM d, yyyy • h:mm a")}</span>
                      </div>
                    </div>
                  ))}
                  {candidate.notes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No notes added yet</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note... Use @mentions to tag team members"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddNote} disabled={!newNote.trim() || addingNote} className="hover-lift">
                    {addingNote ? "Adding..." : "Add Note"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assessment Scores */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Assessment Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {candidate.assessmentScores.map((score, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                      <div>
                        <p className="text-sm font-medium">Assessment {index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(score.completedAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-lg font-bold">
                        {score.score}%
                      </Badge>
                    </div>
                  ))}
                  {candidate.assessmentScores.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No assessments completed</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            {job && (
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full hover-lift bg-transparent" asChild>
                      <Link href={`/jobs/${job.id}`}>View Job Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full hover-lift">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="w-full hover-lift bg-transparent">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                  <Button variant="outline" className="w-full hover-lift bg-transparent">
                    <Award className="w-4 h-4 mr-2" />
                    Send Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EnhancedCircularNavbar />
    </div>
  )
}
