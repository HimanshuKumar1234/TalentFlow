import { db, type Job, type Candidate, type Assessment } from "./db"

// Simulate network latency and errors
const simulateNetworkDelay = () => {
  return new Promise((resolve) => {
    const delay = Math.random() * 1000 + 200 // 200-1200ms
    setTimeout(resolve, delay)
  })
}

const simulateNetworkError = () => {
  if (Math.random() < 0.1) {
    // 10% error rate
    throw new Error("Network error occurred")
  }
}

export class JobsAPI {
  static async getJobs(page = 1, limit = 10, filters: any = {}) {
    await simulateNetworkDelay()

    let query = db.jobs.orderBy("order")

    if (filters.status) {
      query = query.filter((job) => job.status === filters.status)
    }

    if (filters.title) {
      query = query.filter((job) => job.title.toLowerCase().includes(filters.title.toLowerCase()))
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.filter((job) => filters.tags.some((tag: string) => job.tags.includes(tag)))
    }

    const total = await query.count()
    const jobs = await query
      .offset((page - 1) * limit)
      .limit(limit)
      .toArray()

    return {
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getJob(id: string) {
    await simulateNetworkDelay()
    return await db.jobs.get(id)
  }

  static async createJob(job: Omit<Job, "id" | "createdAt" | "updatedAt" | "order">) {
    await simulateNetworkDelay()
    simulateNetworkError()

    const maxOrder = await db.jobs.orderBy("order").last()
    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: (maxOrder?.order || 0) + 1,
    }

    await db.jobs.add(newJob)
    return newJob
  }

  static async updateJob(id: string, updates: Partial<Job>) {
    await simulateNetworkDelay()
    simulateNetworkError()

    await db.jobs.update(id, { ...updates, updatedAt: new Date() })
    return await db.jobs.get(id)
  }

  static async reorderJobs(jobIds: string[]) {
    await simulateNetworkDelay()
    simulateNetworkError()

    const updates = jobIds.map((id, index) => ({ id, order: index }))
    await db.transaction("rw", db.jobs, async () => {
      for (const update of updates) {
        await db.jobs.update(update.id, { order: update.order })
      }
    })
  }
}

export class CandidatesAPI {
  static async getCandidates(filters: any = {}) {
    await simulateNetworkDelay()

    let query = db.candidates.orderBy("appliedAt").reverse()

    if (filters.search) {
      query = query.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          candidate.email.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters.stage) {
      query = query.filter((candidate) => candidate.currentStage === filters.stage)
    }

    if (filters.jobId) {
      query = query.filter((candidate) => candidate.jobId === filters.jobId)
    }

    return await query.toArray()
  }

  static async getCandidate(id: string) {
    await simulateNetworkDelay()
    return await db.candidates.get(id)
  }

  static async updateCandidateStage(id: string, stage: Candidate["currentStage"]) {
    await simulateNetworkDelay()
    simulateNetworkError()

    const candidate = await db.candidates.get(id)
    if (!candidate) throw new Error("Candidate not found")

    const timelineEvent = {
      id: `timeline-${Date.now()}`,
      type: "status_change" as const,
      description: `Status changed to ${stage}`,
      createdAt: new Date(),
    }

    await db.candidates.update(id, {
      currentStage: stage,
      updatedAt: new Date(),
      timeline: [...candidate.timeline, timelineEvent],
    })

    return await db.candidates.get(id)
  }
}

export class AssessmentsAPI {
  static async getAssessments(jobId?: string) {
    await simulateNetworkDelay()

    let query = db.assessments.orderBy("createdAt").reverse()

    if (jobId) {
      query = query.filter((assessment) => assessment.jobId === jobId)
    }

    return await query.toArray()
  }

  static async getAssessment(id: string) {
    await simulateNetworkDelay()
    return await db.assessments.get(id)
  }

  static async createAssessment(assessment: Omit<Assessment, "id" | "createdAt" | "updatedAt" | "shareableLink">) {
    await simulateNetworkDelay()
    simulateNetworkError()

    const newAssessment: Assessment = {
      ...assessment,
      id: `assessment-${Date.now()}`,
      shareableLink: `https://assessment.example.com/assessment-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.assessments.add(newAssessment)
    return newAssessment
  }

  static async updateAssessment(id: string, updates: Partial<Assessment>) {
    await simulateNetworkDelay()
    simulateNetworkError()

    await db.assessments.update(id, { ...updates, updatedAt: new Date() })
    return await db.assessments.get(id)
  }
}
