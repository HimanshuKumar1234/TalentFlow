"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"
import { AssessmentsAPI, type Assessment } from "@/lib/api"
import { ArrowLeft, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { AssessmentPreview } from "@/components/assessment-preview"

export default function AssessmentPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)

  const assessmentId = params.id as string

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true)
        const assessmentData = await AssessmentsAPI.getAssessment(assessmentId)

        if (!assessmentData) {
          toast({
            title: "Error",
            description: "Assessment not found",
            variant: "destructive",
          })
          router.push("/assessments")
          return
        }

        setAssessment(assessmentData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load assessment",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadAssessment()
  }, [assessmentId])

  const handleCopyLink = async () => {
    if (!assessment) return

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

  const handleOpenLink = () => {
    if (!assessment) return
    window.open(assessment.shareableLink, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="space-y-4">
              <div className="h-64 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!assessment) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild className="hover-lift">
            <Link href="/assessments">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessments
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopyLink} className="hover-lift bg-transparent">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={handleOpenLink} className="hover-lift">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Assessment
            </Button>
          </div>
        </div>

        <AssessmentPreview
          title={assessment.title}
          description={assessment.description}
          sections={assessment.sections}
          isPublicView={false}
        />
      </div>

      <EnhancedCircularNavbar />
    </div>
  )
}
