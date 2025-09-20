// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Briefcase, Users, ClipboardList, Home, Settings, Bell, Search } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// const navItems = [
//   { href: "/", icon: Home, label: "Dashboard", notifications: 0 },
//   { href: "/jobs", icon: Briefcase, label: "Jobs", notifications: 3 },
//   { href: "/candidates", icon: Users, label: "Candidates", notifications: 12 },
//   { href: "/assessments", icon: ClipboardList, label: "Assessments", notifications: 0 },
// ]

// const quickActions = [
//   { icon: Search, label: "Quick Search", action: "search" },
//   { icon: Bell, label: "Notifications", action: "notifications", notifications: 5 },
//   { icon: Settings, label: "Settings", action: "settings" },
// ]

// export function EnhancedCircularNavbar() {
//   const pathname = usePathname()
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [showQuickActions, setShowQuickActions] = useState(false)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) return null

//   return (
//     <TooltipProvider>
//       <div className="fixed bottom-6 right-6 z-50">
//         {/* Quick Actions Menu */}
//         {showQuickActions && (
//           <div className="absolute bottom-20 right-0 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
//             {quickActions.map((action, index) => {
//               const Icon = action.icon
//               return (
//                 <Tooltip key={action.action}>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="sm"
//                       className="glass-effect hover-lift animate-float relative"
//                       style={{ animationDelay: `${index * 100}ms` }}
//                     >
//                       <Icon className="w-4 h-4" />
//                       {action.notifications && action.notifications > 0 && (
//                         <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-destructive">
//                           {action.notifications}
//                         </Badge>
//                       )}
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent side="left">
//                     <p>{action.label}</p>
//                   </TooltipContent>
//                 </Tooltip>
//               )
//             })}
//           </div>
//         )}

//         {/* Main Navigation */}
//         <div
//           className={cn("relative transition-all duration-500 ease-out", isExpanded ? "w-80 h-20" : "w-20 h-20")}
//           onMouseEnter={() => setIsExpanded(true)}
//           onMouseLeave={() => setIsExpanded(false)}
//         >
//           <div
//             className={cn(
//               "absolute inset-0 glass-effect transition-all duration-500 ease-out",
//               isExpanded ? "rounded-3xl" : "rounded-full",
//               "backdrop-blur-xl bg-card/80 border border-border/50",
//               "shadow-2xl shadow-primary/10",
//             )}
//           >
//             <div className="flex items-center h-full px-4">
//               {navItems.map((item, index) => {
//                 const isActive = pathname === item.href
//                 const Icon = item.icon

//                 return (
//                   <div key={item.href} className="relative">
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Link
//                           href={item.href}
//                           className={cn(
//                             "flex items-center justify-center transition-all duration-300 hover-lift relative group",
//                             "w-12 h-12 rounded-full",
//                             isActive
//                               ? "bg-primary text-primary-foreground animate-pulse-glow scale-110"
//                               : "text-muted-foreground hover:text-foreground hover:bg-accent/20 hover:scale-105",
//                             isExpanded && index > 0 && "ml-3",
//                           )}
//                         >
//                           <Icon className="w-5 h-5" />
//                           {item.notifications > 0 && (
//                             <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-destructive animate-bounce">
//                               {item.notifications}
//                             </Badge>
//                           )}

//                           {/* Ripple effect on click */}
//                           <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 group-active:animate-ping bg-primary/30" />
//                         </Link>
//                       </TooltipTrigger>
//                       <TooltipContent side={isExpanded ? "top" : "left"}>
//                         <p>{item.label}</p>
//                       </TooltipContent>
//                     </Tooltip>

//                     {/* Expanded label */}
//                     {isExpanded && (
//                       <span
//                         className={cn(
//                           "ml-3 text-sm font-medium transition-all duration-300",
//                           isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
//                           isActive ? "text-primary" : "text-foreground",
//                         )}
//                       >
//                         {item.label}
//                       </span>
//                     )}
//                   </div>
//                 )
//               })}

//               {/* Quick Actions Toggle */}
//               <div className={cn("transition-all duration-300", isExpanded ? "ml-4" : "ml-0")}>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setShowQuickActions(!showQuickActions)}
//                       className={cn(
//                         "w-8 h-8 rounded-full hover-lift transition-all duration-300",
//                         showQuickActions && "bg-accent text-accent-foreground rotate-45",
//                       )}
//                     >
//                       <div className="w-1 h-1 bg-current rounded-full" />
//                       <div className="w-1 h-1 bg-current rounded-full ml-1" />
//                       <div className="w-1 h-1 bg-current rounded-full ml-1" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent side="left">
//                     <p>Quick Actions</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </div>
//             </div>
//           </div>

//           {/* Glow effect for active state */}
//           <div className="absolute inset-0 rounded-full opacity-20 animate-pulse bg-gradient-to-r from-primary to-secondary blur-xl -z-10" />
//         </div>
//       </div>
//     </TooltipProvider>
//   )
// }


"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, Users, ClipboardList, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { href: "/", icon: Home, label: "Dashboard", notifications: 0 },
  { href: "/jobs", icon: Briefcase, label: "Jobs", notifications: 3 },
  { href: "/candidates", icon: Users, label: "Candidates", notifications: 12 },
  { href: "/assessments", icon: ClipboardList, label: "Assessments", notifications: 0 },
]

export function EnhancedCircularNavbar({ position = "right-middle" }: { position?: "right-middle" | "top-left" } = {}) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const positionClasses: Record<string, string> = {
    "right-middle": "fixed top-1/2 right-4 -translate-y-1/2",
    "top-left": "fixed top-6 left-6",
  }

  return (
    <TooltipProvider>
      <div className={cn(positionClasses[position], "z-50")}>
        {/* Container */}
        <div
          className={cn(
            "flex flex-col items-center p-3 rounded-2xl glass-effect backdrop-blur-lg shadow-xl border border-border/40 bg-card/80 transition-all duration-300",
            isExpanded ? "w-56" : "w-16"
          )}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* nav items */}
          <div className="w-full space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <div key={item.href} className="relative w-full">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center w-full rounded-xl px-2 py-2 transition-all duration-300 overflow-hidden relative",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
                        )}
                      >
                        {/* icon with better color */}
                        <Icon
                          className={cn(
                            "w-5 h-5 shrink-0 transition-colors",
                            isActive ? "text-primary-foreground" : "text-foreground/70 group-hover:text-primary"
                          )}
                        />

                        {/* label */}
                        <span
                          className={cn(
                            "ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300",
                            isExpanded ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"
                          )}
                        >
                          {item.label}
                        </span>

                        {/* notifications */}
                        {item.notifications > 0 && (
                          <Badge className="absolute top-1 right-2 w-5 h-5 p-0 text-xs bg-destructive animate-bounce">
                            {item.notifications}
                          </Badge>
                        )}

                        {/* ripple */}
                        <span className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 group-active:animate-ping bg-primary/30" />
                      </Link>
                    </TooltipTrigger>

                    {/* tooltip only when collapsed */}
                    {!isExpanded && (
                      <TooltipContent side={position === "top-left" ? "right" : "left"}>
                        <p>{item.label}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}