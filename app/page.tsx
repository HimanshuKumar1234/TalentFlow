// "use client"

// import { useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"
// import { NotificationSystem } from "@/components/notification-system"
// import { ErrorBoundary } from "@/components/error-boundary"
// import { generateSeedData } from "@/lib/db"
// import { Briefcase, Users, ClipboardList, TrendingUp, Calendar, Award } from "lucide-react"

// export default function Dashboard() {
//   useEffect(() => {
//     generateSeedData()
//   }, [])

//   return (
//     <ErrorBoundary>
//       <div className="min-h-screen bg-background">
//         {/* Header */}
//         <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
//           <div className="container mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold">
//                   Welcome to <span className="text-primary">TalentHub Pro</span>
//                 </h1>
//                 <p className="text-muted-foreground">My Premium Hiring Platform</p>
//               </div>
//               <div className="flex items-center gap-4">
//                 <NotificationSystem />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="container mx-auto px-6 py-8">
//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card className="hover-lift glass-effect border-border/50 group">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
//                 <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-primary">18</div>
//                 <p className="text-xs text-muted-foreground">+2 from last month</p>
//               </CardContent>
//             </Card>

//             <Card className="hover-lift glass-effect border-border/50 group">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-secondary">1,000</div>
//                 <p className="text-xs text-muted-foreground">+180 from last month</p>
//               </CardContent>
//             </Card>

//             <Card className="hover-lift glass-effect border-border/50 group">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Assessments</CardTitle>
//                 <ClipboardList className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-accent">3</div>
//                 <p className="text-xs text-muted-foreground">All active</p>
//               </CardContent>
//             </Card>

//             <Card className="hover-lift glass-effect border-border/50 group">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Hire Rate</CardTitle>
//                 <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-chart-4 transition-colors" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-chart-4">12%</div>
//                 <p className="text-xs text-muted-foreground">+2.1% from last month</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Recent Activity */}
//             <Card className="lg:col-span-2 glass-effect border-border/50">
//               <CardHeader>
//                 <CardTitle>Recent Activity</CardTitle>
//                 <CardDescription>Latest updates from your recruitment pipeline</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {[
//                     {
//                       action: "New application",
//                       candidate: "Sarah Johnson",
//                       job: "Senior Frontend Developer",
//                       time: "2 hours ago",
//                       type: "application",
//                     },
//                     {
//                       action: "Interview scheduled",
//                       candidate: "Mike Chen",
//                       job: "Backend Engineer",
//                       time: "4 hours ago",
//                       type: "interview",
//                     },
//                     {
//                       action: "Assessment completed",
//                       candidate: "Emma Davis",
//                       job: "UX Designer",
//                       time: "6 hours ago",
//                       type: "assessment",
//                     },
//                     {
//                       action: "Offer extended",
//                       candidate: "Alex Rodriguez",
//                       job: "Product Manager",
//                       time: "1 day ago",
//                       type: "offer",
//                     },
//                   ].map((activity, index) => {
//                     const getActivityIcon = (type: string) => {
//                       switch (type) {
//                         case "application":
//                           return <Users className="w-4 h-4 text-blue-500" />
//                         case "interview":
//                           return <Calendar className="w-4 h-4 text-purple-500" />
//                         case "assessment":
//                           return <Award className="w-4 h-4 text-green-500" />
//                         case "offer":
//                           return <TrendingUp className="w-4 h-4 text-orange-500" />
//                         default:
//                           return <div className="w-2 h-2 bg-primary rounded-full" />
//                       }
//                     }

//                     return (
//                       <div
//                         key={index}
//                         className="flex items-center space-x-4 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-all hover-lift cursor-pointer group"
//                       >
//                         <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium group-hover:text-primary transition-colors">
//                             {activity.action}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             {activity.candidate} • {activity.job}
//                           </p>
//                         </div>
//                         <span className="text-xs text-muted-foreground">{activity.time}</span>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Quick Actions */}
//             <Card className="glass-effect border-border/50">
//               <CardHeader>
//                 <CardTitle>Quick Actions</CardTitle>
//                 <CardDescription>Common tasks to get you started</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 gap-3">
//                   {[
//                     {
//                       title: "Post New Job",
//                       description: "Create a new job listing",
//                       href: "/jobs/new",
//                       color: "bg-primary",
//                       icon: Briefcase,
//                     },
//                     {
//                       title: "Review Candidates",
//                       description: "Check pending applications",
//                       href: "/candidates",
//                       color: "bg-secondary",
//                       icon: Users,
//                     },
//                     {
//                       title: "Build Assessment",
//                       description: "Create new evaluation",
//                       href: "/assessments/new",
//                       color: "bg-accent",
//                       icon: ClipboardList,
//                     },
//                     {
//                       title: "Schedule Interview",
//                       description: "Book candidate meetings",
//                       href: "/interviews",
//                       color: "bg-chart-1",
//                       icon: Calendar,
//                     },
//                   ].map((action, index) => {
//                     const Icon = action.icon
//                     return (
//                       <div
//                         key={index}
//                         className="p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-all hover-lift cursor-pointer group"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
//                           >
//                             <Icon className="w-5 h-5 text-white" />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
//                               {action.title}
//                             </h3>
//                             <p className="text-xs text-muted-foreground">{action.description}</p>
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         <EnhancedCircularNavbar />
//       </div>
//     </ErrorBoundary>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedCircularNavbar } from "@/components/enhanced-circular-navbar"
import { NotificationSystem } from "@/components/notification-system"
import { ErrorBoundary } from "@/components/error-boundary"
import { generateSeedData } from "@/lib/db"
import { 
  Briefcase, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Calendar, 
  Award,
  Clock,
  Zap,
  Target,
  Activity,
  ArrowUp,
  ArrowDown
} from "lucide-react"

// Real-time clock component
const LiveClock = () => {
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-sm font-mono bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-1 rounded-full border border-primary/20">
        <Clock className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-primary">Loading...</span>
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-2 text-sm font-mono bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-1 rounded-full border border-primary/20">
      <Clock className="w-4 h-4 text-primary animate-pulse" />
      <span className="text-primary">{time.toLocaleTimeString()}</span>
    </div>
  )
}

// Animated counter component
const AnimatedCounter = ({ value, duration = 2000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    let startTime = null
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [value, duration])
  
  if (!mounted) {
    return (
      <span className="font-bold">
        {prefix}0{suffix}
      </span>
    )
  }
  
  return (
    <span className="font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Progress ring component
const ProgressRing = ({ progress, size = 60, strokeWidth = 4, color = "text-primary" }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted-foreground/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`${color} transition-all duration-1000 ease-out`}
          style={{ strokeLinecap: 'round' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${color}`}>{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

// Pulse animation component
const PulseIndicator = ({ active = false, color = "bg-green-500" }) => {
  if (!active) return <div className={`w-2 h-2 ${color} rounded-full opacity-50`} />
  
  return (
    <div className="relative">
      <div className={`w-2 h-2 ${color} rounded-full`} />
      <div className={`absolute inset-0 w-2 h-2 ${color} rounded-full animate-ping opacity-75`} />
    </div>
  )
}

// Trending indicator
const TrendingIndicator = ({ value, trend }) => {
  const isPositive = trend > 0
  return (
    <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      <span>{Math.abs(trend)}%</span>
    </div>
  )
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    activeJobs: { value: 18, trend: 12.5, target: 25 },
    candidates: { value: 1000, trend: -5.2, target: 1200 },
    assessments: { value: 3, trend: 50, target: 5 },
    hireRate: { value: 12, trend: 8.7, target: 15 }
  })

  const [realTimeActivity, setRealTimeActivity] = useState([
    { id: 1, active: true, type: "New Application", time: Date.now() },
    { id: 2, active: false, type: "Interview Started", time: Date.now() - 300000 },
    { id: 3, active: true, type: "Assessment Completed", time: Date.now() - 600000 },
  ])

  useEffect(() => {
    setMounted(true)
    generateSeedData()
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeActivity(prev => 
        prev.map(activity => ({
          ...activity,
          active: Math.random() > 0.7
        }))
      )
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome to <span className="text-primary">TalentHub Pro</span>
                  </h1>
                  <p className="text-muted-foreground">My Premium Hiring Platform</p>
                </div>
                {/* Live status indicator */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <PulseIndicator active={true} color="bg-green-500" />
                  <span className="text-green-500 text-xs font-medium">Live</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <LiveClock />
                <NotificationSystem />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Real-time Activity Bar */}
          {mounted && (
            <Card className="mb-6 glass-effect border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Real-time Activity</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {realTimeActivity.map(activity => (
                        <div key={activity.id} className="flex items-center gap-2">
                          <PulseIndicator active={activity.active} />
                          <span className="text-sm text-muted-foreground">{activity.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>System Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card 
              className="hover-lift glass-effect border-border/50 group overflow-hidden relative cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/jobs'}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <div className="flex items-center gap-2">
                  <TrendingIndicator value={stats.activeJobs.value} trend={stats.activeJobs.trend} />
                  <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      <AnimatedCounter value={stats.activeJobs.value} />
                    </div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </div>
                  <ProgressRing 
                    progress={(stats.activeJobs.value / stats.activeJobs.target) * 100} 
                    color="text-primary"
                    size={50}
                  />
                </div>
              </CardContent>
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Click to view →</span>
              </div>
            </Card>

            <Card 
              className="hover-lift glass-effect border-border/50 group overflow-hidden relative cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/candidates'}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <div className="flex items-center gap-2">
                  <TrendingIndicator value={stats.candidates.value} trend={stats.candidates.trend} />
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-secondary">
                      <AnimatedCounter value={stats.candidates.value} />
                    </div>
                    <p className="text-xs text-muted-foreground">+180 from last month</p>
                  </div>
                  <ProgressRing 
                    progress={(stats.candidates.value / stats.candidates.target) * 100} 
                    color="text-secondary"
                    size={50}
                  />
                </div>
              </CardContent>
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-full">Click to view →</span>
              </div>
            </Card>

            <Card 
              className="hover-lift glass-effect border-border/50 group overflow-hidden relative cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/assessments'}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
                <div className="flex items-center gap-2">
                  <TrendingIndicator value={stats.assessments.value} trend={stats.assessments.trend} />
                  <ClipboardList className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-accent">
                      <AnimatedCounter value={stats.assessments.value} />
                    </div>
                    <p className="text-xs text-muted-foreground">All active</p>
                  </div>
                  <ProgressRing 
                    progress={(stats.assessments.value / stats.assessments.target) * 100} 
                    color="text-accent"
                    size={50}
                  />
                </div>
              </CardContent>
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">Click to view →</span>
              </div>
            </Card>

            <Card 
              className="hover-lift glass-effect border-border/50 group overflow-hidden relative cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/'}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-chart-4/5 to-chart-4/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hire Rate</CardTitle>
                <div className="flex items-center gap-2">
                  <TrendingIndicator value={stats.hireRate.value} trend={stats.hireRate.trend} />
                  <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-chart-4 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-chart-4">
                      <AnimatedCounter value={stats.hireRate.value} suffix="%" />
                    </div>
                    <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                  </div>
                  <ProgressRing 
                    progress={(stats.hireRate.value / stats.hireRate.target) * 100} 
                    color="text-chart-4"
                    size={50}
                  />
                </div>
              </CardContent>
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-chart-4 bg-chart-4/10 px-2 py-1 rounded-full">Click to view →</span>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Recent Activity */}
            <Card className="lg:col-span-2 glass-effect border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from your recruitment pipeline</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">Live updates</span>
                  </div>
                </div>
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
                      priority: "high"
                    },
                    {
                      action: "Interview scheduled",
                      candidate: "Mike Chen",
                      job: "Backend Engineer", 
                      time: "4 hours ago",
                      type: "interview",
                      priority: "medium"
                    },
                    {
                      action: "Assessment completed",
                      candidate: "Emma Davis",
                      job: "UX Designer",
                      time: "6 hours ago",
                      type: "assessment",
                      priority: "low"
                    },
                    {
                      action: "Offer extended",
                      candidate: "Alex Rodriguez",
                      job: "Product Manager",
                      time: "1 day ago",
                      type: "offer",
                      priority: "high"
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

                    const getPriorityColor = (priority: string) => {
                      switch (priority) {
                        case "high": return "border-l-red-500"
                        case "medium": return "border-l-yellow-500"
                        case "low": return "border-l-green-500"
                        default: return "border-l-gray-500"
                      }
                    }

                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-4 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-all hover-lift cursor-pointer group border-l-2 ${getPriorityColor(activity.priority)}`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'slideInFromLeft 0.5s ease-out forwards'
                        }}
                      >
                        <div className="flex-shrink-0 relative">
                          {getActivityIcon(activity.type)}
                          {activity.priority === 'high' && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.candidate} • {activity.job}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Target className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs capitalize text-muted-foreground">{activity.priority}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Actions */}
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
                      href: "/jobs",
                      color: "bg-gradient-to-r from-primary to-primary/80",
                      icon: Briefcase,
                      badge: "Hot"
                    },
                    {
                      title: "Review Candidates",
                      description: "Check pending applications",
                      href: "/candidates",
                      color: "bg-gradient-to-r from-secondary to-secondary/80",
                      icon: Users,
                      badge: "3 New"
                    },
                    {
                      title: "Build Assessment",
                      description: "Create new evaluation",
                      href: "/assessments",
                      color: "bg-gradient-to-r from-accent to-accent/80",
                      icon: ClipboardList,
                      badge: null
                    },
                    // {
                    //   title: "Schedule Interview",
                    //   description: "Book candidate meetings",
                    //   href: "/interviews",
                    //   color: "bg-gradient-to-r from-chart-1 to-chart-1/80",
                    //   icon: Calendar,
                    //   badge: "Today"
                    // },
                  ].map((action, index) => {
                    const Icon = action.icon
                    return (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-all hover-lift cursor-pointer group relative overflow-hidden"
                        style={{
                          animationDelay: `${index * 150}ms`,
                          animation: 'slideInFromRight 0.6s ease-out forwards'
                        }}
                        onClick={() => window.location.href = action.href}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div
                            className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                                {action.title}
                              </h3>
                              {action.badge && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                                  {action.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <EnhancedCircularNavbar />
        
        {/* Add some CSS animations */}
        <style jsx>{`
          @keyframes slideInFromLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInFromRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </ErrorBoundary>
  )
}