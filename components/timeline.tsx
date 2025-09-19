"use client"

import { motion } from "framer-motion"
import { Calendar, Edit, Archive, ArchiveRestore, UserPlus, ArrowRight, FileText, Star, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface TimelineEvent {
  id: string
  type:
    | "job_created"
    | "job_updated"
    | "job_archived"
    | "job_restored"
    | "candidate_applied"
    | "candidate_stage_changed"
    | "candidate_note_added"
    | "assessment_created"
    | "assessment_completed"
  title: string
  description?: string
  timestamp: string
  metadata?: {
    candidateName?: string
    fromStage?: string
    toStage?: string
    fieldChanged?: string
    oldValue?: string
    newValue?: string
    assessmentType?: string
    score?: number
  }
}

interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}

const eventIcons = {
  job_created: Calendar,
  job_updated: Edit,
  job_archived: Archive,
  job_restored: ArchiveRestore,
  candidate_applied: UserPlus,
  candidate_stage_changed: ArrowRight,
  candidate_note_added: FileText,
  assessment_created: Star,
  assessment_completed: Star,
}

const eventColors = {
  job_created: "bg-blue-500",
  job_updated: "bg-yellow-500",
  job_archived: "bg-gray-500",
  job_restored: "bg-green-500",
  candidate_applied: "bg-emerald-500",
  candidate_stage_changed: "bg-purple-500",
  candidate_note_added: "bg-orange-500",
  assessment_created: "bg-pink-500",
  assessment_completed: "bg-indigo-500",
}

export function Timeline({ events, className = "" }: TimelineProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  const getEventDescription = (event: TimelineEvent) => {
    const { type, metadata } = event

    switch (type) {
      case "job_updated":
        if (metadata?.fieldChanged) {
          return `Changed ${metadata.fieldChanged} from "${metadata.oldValue}" to "${metadata.newValue}"`
        }
        return "Job details updated"

      case "candidate_stage_changed":
        return `${metadata?.candidateName} moved from ${metadata?.fromStage} to ${metadata?.toStage}`

      case "candidate_applied":
        return `${metadata?.candidateName} submitted application`

      case "assessment_completed":
        return `${metadata?.candidateName} completed ${metadata?.assessmentType} assessment (Score: ${metadata?.score}%)`

      default:
        return event.description
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {events.map((event, index) => {
        const Icon = eventIcons[event.type]
        const colorClass = eventColors[event.type]
        const isLeft = index % 2 === 0

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-4 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
          >
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              {index < events.length - 1 && <div className="w-0.5 h-12 bg-border mt-2" />}
            </div>

            {/* Event Card */}
            <motion.div whileHover={{ scale: 1.02 }} className={`flex-1 max-w-md ${isLeft ? "" : "text-right"}`}>
              <Card className="glass-effect border-border/50 hover:border-border transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(event.timestamp)}
                    </div>
                  </div>

                  {getEventDescription(event) && (
                    <p className="text-sm text-muted-foreground mb-2">{getEventDescription(event)}</p>
                  )}

                  {/* Stage Change Visualization */}
                  {event.type === "candidate_stage_changed" && event.metadata && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {event.metadata.fromStage}
                      </Badge>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="default" className="text-xs">
                        {event.metadata.toStage}
                      </Badge>
                    </div>
                  )}

                  {/* Assessment Score */}
                  {event.type === "assessment_completed" && event.metadata?.score && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Score</span>
                        <span className="font-semibold">{event.metadata.score}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${event.metadata.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
