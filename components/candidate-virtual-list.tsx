"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Candidate, Job } from "@/lib/api"
import { Mail, Phone, Calendar, Award, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { format } from "date-fns"

interface CandidateVirtualListProps {
  candidates: Candidate[]
  jobs: Job[]
  onStageChange: (candidateId: string, stage: Candidate["currentStage"]) => void
}

export function CandidateVirtualList({ candidates, jobs, onStageChange }: CandidateVirtualListProps) {
  const jobsMap = useMemo(() => {
    return jobs.reduce(
      (acc, job) => {
        acc[job.id] = job
        return acc
      },
      {} as Record<string, Job>,
    )
  }, [jobs])

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
    <ScrollArea className="h-[calc(100vh-400px)]">
      <div className="space-y-4">
        {candidates.map((candidate) => {
          const job = jobsMap[candidate.jobId]
          const averageScore =
            candidate.assessmentScores.length > 0
              ? Math.round(
                  candidate.assessmentScores.reduce((sum, score) => sum + score.score, 0) /
                    candidate.assessmentScores.length,
                )
              : null

          return (
            <Card key={candidate.id} className="glass-effect border-border/50 hover-lift transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="font-semibold">{getInitials(candidate.name)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-balance">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job?.title || "Unknown Position"} • {job?.company || "Unknown Company"}
                        </p>
                      </div>
                      <Badge className={cn("text-white ml-2", getStageColor(candidate.currentStage))}>
                        {candidate.currentStage.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
                        Applied {format(new Date(candidate.appliedAt), "MMM d")}
                      </div>
                      {averageScore && (
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {averageScore}% avg score
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {job?.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {job && job.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={candidate.currentStage}
                          onValueChange={(value: Candidate["currentStage"]) => onStageChange(candidate.id, value)}
                        >
                          <SelectTrigger className="w-32">
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

                        <Button variant="outline" size="sm" asChild className="hover-lift bg-transparent">
                          <Link href={`/candidates/${candidate.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </ScrollArea>
  )
}
