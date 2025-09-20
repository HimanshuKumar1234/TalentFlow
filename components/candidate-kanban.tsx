"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { Candidate, Job } from "@/lib/api"
import { Mail, Award, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

interface CandidateKanbanProps {
  candidates: Candidate[]
  jobs: Job[]
  onStageChange: (candidateId: string, stage: Candidate["currentStage"]) => void
}

const stages = [
  { id: "applied", title: "Applied", color: "bg-blue-500" },
  { id: "screening", title: "Screening", color: "bg-yellow-500" },
  { id: "interview", title: "Interview", color: "bg-purple-500" },
  { id: "offer", title: "Offer", color: "bg-green-500" },
  { id: "hired", title: "Hired", color: "bg-emerald-500" },
  { id: "rejected", title: "Rejected", color: "bg-red-500" },
]

export function CandidateKanban({ candidates, jobs, onStageChange }: CandidateKanbanProps) {
  const jobsMap = useMemo(() => {
    return jobs.reduce(
      (acc, job) => {
        acc[job.id] = job
        return acc
      },
      {} as Record<string, Job>,
    )
  }, [jobs])

  const candidatesByStage = useMemo(() => {
    return stages.reduce(
      (acc, stage) => {
        acc[stage.id] = candidates.filter((candidate) => candidate.currentStage === stage.id)
        return acc
      },
      {} as Record<string, Candidate[]>,
    )
  }, [candidates])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // const handleDragEnd = (result: any) => {
  //   const { destination, source, draggableId } = result

  //   if (!destination) return
  //   if (destination.droppableId === source.droppableId && destination.index === source.index) return

  //   const candidateId = draggableId
  //   const newStage = destination.droppableId as Candidate["currentStage"]

  //   onStageChange(candidateId, newStage)
  // }

  const handleDragEnd = (result: any) => {
  const { destination, source, draggableId } = result

  if (!destination) return
  if (destination.droppableId === source.droppableId && destination.index === source.index) return

  const candidateId = draggableId
  const newStage = destination.droppableId as Candidate["currentStage"]

  if (source.droppableId === destination.droppableId) {
    onStageChange(candidateId, newStage, destination.index) // pass index if needed
    return
  }

  onStageChange(candidateId, newStage, 0)
}

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageCandidates = candidatesByStage[stage.id] || []

          return (
            <Card key={stage.id} className="glass-effect border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                  {stage.title}
                  <Badge variant="outline" className="ml-auto">
                    {stageCandidates.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Droppable droppableId={stage.id}>
  {(provided, snapshot) => (
    <ScrollArea className="h-[calc(100vh-500px)]">

      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={cn(
          "p-3 space-y-3 min-h-[200px]",
          snapshot.isDraggingOver && "bg-accent/20"
        )}
      >
        {stageCandidates.map((candidate, index) => {
          const job = jobsMap[candidate.jobId]
          const averageScore =
            candidate.assessmentScores.length > 0
              ? Math.round(
                  candidate.assessmentScores.reduce((sum, score) => sum + score.score, 0) /
                    candidate.assessmentScores.length
                )
              : null

          return (
            <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Card
                    className={cn(
                      "bg-card/80 border-border/50 hover-lift transition-all cursor-grab",
                      snapshot.isDragging && "rotate-2 scale-105 shadow-2xl"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="text-xs">
                            {getInitials(candidate.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight">
                            {candidate.name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {job?.title || "Unknown Position"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Applied {format(new Date(candidate.appliedAt), "MMM d")}
                        </div>
                        {averageScore && (
                          <div className="flex items-center gap-1 text-xs">
                            <Award className="w-3 h-3 text-yellow-500" />
                            <span className="font-medium">{averageScore}%</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {job?.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                          <Link href={`/candidates/${candidate.id}`}>
                            <Eye className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Draggable>
          )
        })}

        {provided.placeholder}

        {stageCandidates.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No candidates in this stage
          </div>
        )}
      </div>
    </ScrollArea>
  )}
</Droppable>

              </CardContent>
            </Card>
          )
        })}
      </div>
    </DragDropContext>
  )
}