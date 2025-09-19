"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"
import { NotificationSystem } from "@/components/notification-system"
import { ErrorBoundary } from "@/components/error-boundary"
import { generateSeedData } from "@/lib/db"
import { Briefcase, Users, ClipboardList, TrendingUp, Calendar, Award } from "lucide-react"

export default function Dashboard() {
  useEffect(() => {
    generateSeedData()
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome to <span className="text-primary">TalentHub Pro</span>
                </h1>
                <p className="text-muted-foreground">My Premium Hiring Platform</p>
              </div>
              <div className="flex items-center gap-4">
                <NotificationSystem />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover-lift glass-effect border-border/50 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">18</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card className="hover-lift glass-effect border-border/50 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">1,000</div>
                <p className="text-xs text-muted-foreground">+180 from last month</p>
              </CardContent>
            </Card>

            <Card className="hover-lift glass-effect border-border/50 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">3</div>
                <p className="text-xs text-muted-foreground">All active</p>
              </CardContent>
            </Card>

            <Card className="hover-lift glass-effect border-border/50 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hire Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-chart-4 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-4">12%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2 glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your recruitment pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "New application",
                      candidate: "Sarah Johnson",
                      job: "Senior Frontend Developer",
                      time: "2 hours ago",
                      type: "application",
                    },
                    {
                      action: "Interview scheduled",
                      candidate: "Mike Chen",
                      job: "Backend Engineer",
                      time: "4 hours ago",
                      type: "interview",
                    },
                    {
                      action: "Assessment completed",
                      candidate: "Emma Davis",
                      job: "UX Designer",
                      time: "6 hours ago",
                      type: "assessment",
                    },
                    {
                      action: "Offer extended",
                      candidate: "Alex Rodriguez",
                      job: "Product Manager",
                      time: "1 day ago",
                      type: "offer",
                    },
                  ].map((activity, index) => {
                    const getActivityIcon = (type: string) => {
                      switch (type) {
                        case "application":
                          return <Users className="w-4 h-4 text-blue-500" />
                        case "interview":
                          return <Calendar className="w-4 h-4 text-purple-500" />
                        case "assessment":
                          return <Award className="w-4 h-4 text-green-500" />
                        case "offer":
                          return <TrendingUp className="w-4 h-4 text-orange-500" />
                        default:
                          return <div className="w-2 h-2 bg-primary rounded-full" />
                      }
                    }

                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-all hover-lift cursor-pointer group"
                      >
                        <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.candidate} • {activity.job}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to get you started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      title: "Post New Job",
                      description: "Create a new job listing",
                      href: "/jobs/new",
                      color: "bg-primary",
                      icon: Briefcase,
                    },
                    {
                      title: "Review Candidates",
                      description: "Check pending applications",
                      href: "/candidates",
                      color: "bg-secondary",
                      icon: Users,
                    },
                    {
                      title: "Build Assessment",
                      description: "Create new evaluation",
                      href: "/assessments/new",
                      color: "bg-accent",
                      icon: ClipboardList,
                    },
                    {
                      title: "Schedule Interview",
                      description: "Book candidate meetings",
                      href: "/interviews",
                      color: "bg-chart-1",
                      icon: Calendar,
                    },
                  ].map((action, index) => {
                    const Icon = action.icon
                    return (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-all hover-lift cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <EnhancedCircularNavbar />
      </div>
    </ErrorBoundary>
  )
}
