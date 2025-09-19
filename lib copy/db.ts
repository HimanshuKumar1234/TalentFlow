import Dexie, { type Table } from "dexie"

export interface Job {
  id: string
  title: string
  slug: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  status: "active" | "archived"
  tags: string[]
  company: string
  location: string
  salary?: string
  type: "full-time" | "part-time" | "contract" | "remote"
  createdAt: Date
  updatedAt: Date
  order: number
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  resume?: string
  currentStage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected"
  jobId: string
  appliedAt: Date
  updatedAt: Date
  notes: Note[]
  assessmentScores: AssessmentScore[]
  timeline: TimelineEvent[]
}

export interface Note {
  id: string
  content: string
  mentions: string[]
  createdAt: Date
  createdBy: string
}

export interface TimelineEvent {
  id: string
  type: "status_change" | "note_added" | "assessment_completed" | "interview_scheduled"
  description: string
  createdAt: Date
  metadata?: Record<string, any>
}

export interface Assessment {
  id: string
  jobId: string
  title: string
  description: string
  sections: AssessmentSection[]
  isPublished: boolean
  shareableLink: string
  createdAt: Date
  updatedAt: Date
}

export interface AssessmentSection {
  id: string
  title: string
  description?: string
  questions: Question[]
  order: number
}

export interface Question {
  id: string
  type: "single-choice" | "multi-choice" | "short-text" | "long-text" | "numeric" | "file-upload"
  question: string
  required: boolean
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
  conditionalLogic?: {
    dependsOn: string
    showWhen: string | string[]
  }
  order: number
}

export interface AssessmentResponse {
  id: string
  assessmentId: string
  candidateId: string
  responses: Record<string, any>
  completedAt: Date
  score?: number
}

export interface AssessmentScore {
  assessmentId: string
  score: number
  completedAt: Date
}

class JobManagementDB extends Dexie {
  jobs!: Table<Job>
  candidates!: Table<Candidate>
  assessments!: Table<Assessment>
  assessmentResponses!: Table<AssessmentResponse>

  constructor() {
    super("JobManagementDB")
    this.version(1).stores({
      jobs: "id, title, slug, status, createdAt, order",
      candidates: "id, name, email, currentStage, jobId, appliedAt",
      assessments: "id, jobId, title, isPublished, createdAt",
      assessmentResponses: "id, assessmentId, candidateId, completedAt",
    })
  }
}

export const db = new JobManagementDB()

// Seed data generation
export const generateSeedData = async () => {
  const existingJobs = await db.jobs.count()
  if (existingJobs > 0) return // Already seeded

  // Generate 25 jobs
  const jobs: Job[] = Array.from({ length: 25 }, (_, i) => ({
    id: `job-${i + 1}`,
    title:
      [
        "Senior Frontend Developer",
        "Backend Engineer",
        "Product Manager",
        "UX Designer",
        "Data Scientist",
        "DevOps Engineer",
        "Mobile Developer",
        "QA Engineer",
        "Marketing Manager",
        "Sales Representative",
      ][i % 10] + (i > 9 ? ` ${Math.floor(i / 10) + 1}` : ""),
    slug: `job-${i + 1}-slug`,
    description: "Join our dynamic team and help build the future of technology.",
    responsibilities: [
      "Develop and maintain high-quality software",
      "Collaborate with cross-functional teams",
      "Participate in code reviews and technical discussions",
      "Contribute to architectural decisions",
    ],
    qualifications: [
      "3+ years of relevant experience",
      "Strong problem-solving skills",
      "Excellent communication abilities",
      "Bachelor's degree in related field",
    ],
    status: Math.random() > 0.3 ? "active" : "archived",
    tags: ["Remote", "Full-time", "Tech", "Startup"].slice(0, Math.floor(Math.random() * 4) + 1),
    company: ["TechCorp", "InnovateLab", "FutureWorks", "CodeCraft", "DataDriven"][i % 5],
    location: ["San Francisco", "New York", "Austin", "Seattle", "Remote"][i % 5],
    salary: `$${80 + Math.floor(Math.random() * 120)}k - $${120 + Math.floor(Math.random() * 80)}k`,
    type: ["full-time", "part-time", "contract", "remote"][Math.floor(Math.random() * 4)] as any,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    order: i,
  }))

  await db.jobs.bulkAdd(jobs)

  // Generate 1000 candidates
  const stages = ["applied", "screening", "interview", "offer", "hired", "rejected"] as const
  const candidates: Candidate[] = Array.from({ length: 1000 }, (_, i) => {
    const jobId = jobs[Math.floor(Math.random() * jobs.length)].id
    const appliedAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)

    return {
      id: `candidate-${i + 1}`,
      name: `Candidate ${i + 1}`,
      email: `candidate${i + 1}@example.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
      currentStage: stages[Math.floor(Math.random() * stages.length)],
      jobId,
      appliedAt,
      updatedAt: new Date(),
      notes: [],
      assessmentScores: [],
      timeline: [
        {
          id: `timeline-${i + 1}-1`,
          type: "status_change",
          description: "Application submitted",
          createdAt: appliedAt,
        },
      ],
    }
  })

  await db.candidates.bulkAdd(candidates)

  // Generate 3 assessments
  const assessments: Assessment[] = Array.from({ length: 3 }, (_, i) => ({
    id: `assessment-${i + 1}`,
    jobId: jobs[i].id,
    title: `${jobs[i].title} Assessment`,
    description: "Comprehensive evaluation for this position",
    sections: [
      {
        id: `section-${i + 1}-1`,
        title: "Technical Skills",
        questions: Array.from({ length: 5 }, (_, j) => ({
          id: `question-${i + 1}-${j + 1}`,
          type: "single-choice" as const,
          question: `Technical question ${j + 1}`,
          required: true,
          options: ["Option A", "Option B", "Option C", "Option D"],
          order: j,
        })),
        order: 0,
      },
      {
        id: `section-${i + 1}-2`,
        title: "Experience",
        questions: Array.from({ length: 5 }, (_, j) => ({
          id: `question-${i + 1}-${j + 6}`,
          type: "long-text" as const,
          question: `Experience question ${j + 1}`,
          required: j < 3,
          validation: { maxLength: 500 },
          order: j,
        })),
        order: 1,
      },
    ],
    isPublished: true,
    shareableLink: `https://assessment.example.com/assessment-${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }))

  await db.assessments.bulkAdd(assessments)

  console.log("Seed data generated successfully!")
}
