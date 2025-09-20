// // "use client"

// // import { useState, useEffect } from "react"
// // import Link from "next/link"
// // import { usePathname } from "next/navigation"
// // import { Briefcase, Users, ClipboardList, Home, Settings, Bell, Search } from "lucide-react"
// // import { cn } from "@/lib/utils"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// // import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// // const navItems = [
// //   { href: "/", icon: Home, label: "Dashboard", notifications: 0 },
// //   { href: "/jobs", icon: Briefcase, label: "Jobs", notifications: 3 },
// //   { href: "/candidates", icon: Users, label: "Candidates", notifications: 12 },
// //   { href: "/assessments", icon: ClipboardList, label: "Assessments", notifications: 0 },
// // ]

// // const quickActions = [
// //   { icon: Search, label: "Quick Search", action: "search" },
// //   { icon: Bell, label: "Notifications", action: "notifications", notifications: 5 },
// //   { icon: Settings, label: "Settings", action: "settings" },
// // ]

// // export function EnhancedCircularNavbar() {
// //   const pathname = usePathname()
// //   const [isExpanded, setIsExpanded] = useState(false)
// //   const [showQuickActions, setShowQuickActions] = useState(false)
// //   const [mounted, setMounted] = useState(false)

// //   useEffect(() => {
// //     setMounted(true)
// //   }, [])

// //   if (!mounted) return null

// //   return (
// //     <TooltipProvider>
// //       <div className="fixed bottom-6 right-6 z-50">
// //         {/* Quick Actions Menu */}
// //         {showQuickActions && (
// //           <div className="absolute bottom-20 right-0 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
// //             {quickActions.map((action, index) => {
// //               const Icon = action.icon
// //               return (
// //                 <Tooltip key={action.action}>
// //                   <TooltipTrigger asChild>
// //                     <Button
// //                       size="sm"
// //                       className="glass-effect hover-lift animate-float relative"
// //                       style={{ animationDelay: `${index * 100}ms` }}
// //                     >
// //                       <Icon className="w-4 h-4" />
// //                       {action.notifications && action.notifications > 0 && (
// //                         <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-destructive">
// //                           {action.notifications}
// //                         </Badge>
// //                       )}
// //                     </Button>
// //                   </TooltipTrigger>
// //                   <TooltipContent side="left">
// //                     <p>{action.label}</p>
// //                   </TooltipContent>
// //                 </Tooltip>
// //               )
// //             })}
// //           </div>
// //         )}

// //         {/* Main Navigation */}
// //         <div
// //           className={cn("relative transition-all duration-500 ease-out", isExpanded ? "w-80 h-20" : "w-20 h-20")}
// //           onMouseEnter={() => setIsExpanded(true)}
// //           onMouseLeave={() => setIsExpanded(false)}
// //         >
// //           <div
// //             className={cn(
// //               "absolute inset-0 glass-effect transition-all duration-500 ease-out",
// //               isExpanded ? "rounded-3xl" : "rounded-full",
// //               "backdrop-blur-xl bg-card/80 border border-border/50",
// //               "shadow-2xl shadow-primary/10",
// //             )}
// //           >
// //             <div className="flex items-center h-full px-4">
// //               {navItems.map((item, index) => {
// //                 const isActive = pathname === item.href
// //                 const Icon = item.icon

// //                 return (
// //                   <div key={item.href} className="relative">
// //                     <Tooltip>
// //                       <TooltipTrigger asChild>
// //                         <Link
// //                           href={item.href}
// //                           className={cn(
// //                             "flex items-center justify-center transition-all duration-300 hover-lift relative group",
// //                             "w-12 h-12 rounded-full",
// //                             isActive
// //                               ? "bg-primary text-primary-foreground animate-pulse-glow scale-110"
// //                               : "text-muted-foreground hover:text-foreground hover:bg-accent/20 hover:scale-105",
// //                             isExpanded && index > 0 && "ml-3",
// //                           )}
// //                         >
// //                           <Icon className="w-5 h-5" />
// //                           {item.notifications > 0 && (
// //                             <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-destructive animate-bounce">
// //                               {item.notifications}
// //                             </Badge>
// //                           )}

// //                           {/* Ripple effect on click */}
// //                           <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 group-active:animate-ping bg-primary/30" />
// //                         </Link>
// //                       </TooltipTrigger>
// //                       <TooltipContent side={isExpanded ? "top" : "left"}>
// //                         <p>{item.label}</p>
// //                       </TooltipContent>
// //                     </Tooltip>

// //                     {/* Expanded label */}
// //                     {isExpanded && (
// //                       <span
// //                         className={cn(
// //                           "ml-3 text-sm font-medium transition-all duration-300",
// //                           isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
// //                           isActive ? "text-primary" : "text-foreground",
// //                         )}
// //                       >
// //                         {item.label}
// //                       </span>
// //                     )}
// //                   </div>
// //                 )
// //               })}

// //               {/* Quick Actions Toggle */}
// //               <div className={cn("transition-all duration-300", isExpanded ? "ml-4" : "ml-0")}>
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <Button
// //                       variant="ghost"
// //                       size="sm"
// //                       onClick={() => setShowQuickActions(!showQuickActions)}
// //                       className={cn(
// //                         "w-8 h-8 rounded-full hover-lift transition-all duration-300",
// //                         showQuickActions && "bg-accent text-accent-foreground rotate-45",
// //                       )}
// //                     >
// //                       <div className="w-1 h-1 bg-current rounded-full" />
// //                       <div className="w-1 h-1 bg-current rounded-full ml-1" />
// //                       <div className="w-1 h-1 bg-current rounded-full ml-1" />
// //                     </Button>
// //                   </TooltipTrigger>
// //                   <TooltipContent side="left">
// //                     <p>Quick Actions</p>
// //                   </TooltipContent>
// //                 </Tooltip>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Glow effect for active state */}
// //           <div className="absolute inset-0 rounded-full opacity-20 animate-pulse bg-gradient-to-r from-primary to-secondary blur-xl -z-10" />
// //         </div>
// //       </div>
// //     </TooltipProvider>
// //   )
// // }


// "use client"

// import React, { useEffect, useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Briefcase, Users, ClipboardList, Home } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Badge } from "@/components/ui/badge"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// const navItems = [
//   { href: "/", icon: Home, label: "Dashboard", notifications: 0 },
//   { href: "/jobs", icon: Briefcase, label: "Jobs", notifications: 3 },
//   { href: "/candidates", icon: Users, label: "Candidates", notifications: 12 },
//   { href: "/assessments", icon: ClipboardList, label: "Assessments", notifications: 0 },
// ]

// export function EnhancedCircularNavbar({ position = "right-middle" }: { position?: "right-middle" | "top-left" } = {}) {
//   const pathname = usePathname()
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => setMounted(true), [])
//   if (!mounted) return null

//   const positionClasses: Record<string, string> = {
//     "right-middle": "fixed top-1/2 right-4 -translate-y-1/2",
//     "top-left": "fixed top-6 left-6",
//   }

//   return (
//     <TooltipProvider>
//       <div className={cn(positionClasses[position], "z-50")}>
//         {/* Container */}
//         <div
//           className={cn(
//             "flex flex-col items-center p-3 rounded-2xl glass-effect backdrop-blur-lg shadow-xl border border-border/40 bg-card/80 transition-all duration-300",
//             isExpanded ? "w-56" : "w-16"
//           )}
//           onMouseEnter={() => setIsExpanded(true)}
//           onMouseLeave={() => setIsExpanded(false)}
//         >
//           {/* nav items */}
//           <div className="w-full space-y-2">
//             {navItems.map((item) => {
//               const Icon = item.icon
//               const isActive = pathname === item.href

//               return (
//                 <div key={item.href} className="relative w-full">
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Link
//                         href={item.href}
//                         className={cn(
//                           "group flex items-center w-full rounded-xl px-2 py-2 transition-all duration-300 overflow-hidden relative",
//                           isActive
//                             ? "bg-primary text-primary-foreground shadow-md"
//                             : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
//                         )}
//                       >
//                         {/* icon with better color */}
//                         <Icon
//                           className={cn(
//                             "w-5 h-5 shrink-0 transition-colors",
//                             isActive ? "text-primary-foreground" : "text-foreground/70 group-hover:text-primary"
//                           )}
//                         />

//                         {/* label */}
//                         <span
//                           className={cn(
//                             "ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300",
//                             isExpanded ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"
//                           )}
//                         >
//                           {item.label}
//                         </span>

//                         {/* notifications */}
//                         {item.notifications > 0 && (
//                           <Badge className="absolute top-1 right-2 w-5 h-5 p-0 text-xs bg-destructive animate-bounce">
//                             {item.notifications}
//                           </Badge>
//                         )}

//                         {/* ripple */}
//                         <span className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 group-active:animate-ping bg-primary/30" />
//                       </Link>
//                     </TooltipTrigger>

//                     {/* tooltip only when collapsed */}
//                     {!isExpanded && (
//                       <TooltipContent side={position === "top-left" ? "right" : "left"}>
//                         <p>{item.label}</p>
//                       </TooltipContent>
//                     )}
//                   </Tooltip>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   )
// }

"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, Users, ClipboardList, Home, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { href: "/", icon: Home, label: "Dashboard", notifications: 0, color: "text-blue-500" },
  { href: "/jobs", icon: Briefcase, label: "Jobs", notifications: 3, color: "text-emerald-500" },
  { href: "/candidates", icon: Users, label: "Candidates", notifications: 12, color: "text-purple-500" },
  { href: "/assessments", icon: ClipboardList, label: "Assessments", notifications: 0, color: "text-orange-500" },
]

export function EnhancedCircularNavbar({ position = "right-middle" }: { position?: "right-middle" | "top-left" } = {}) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const positionClasses: Record<string, string> = {
    "right-middle": "fixed top-1/2 right-6 -translate-y-1/2",
    "top-left": "fixed top-6 left-6",
  }

  return (
    <TooltipProvider>
      <div className={cn(positionClasses[position], "z-50")}>
        {/* Main Container */}
        <div
          className={cn(
            "relative flex flex-col items-center transition-all duration-500 ease-out transform",
            isExpanded ? "w-64" : "w-20"
          )}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => {
            setIsExpanded(false)
            setHoveredItem(null)
          }}
        >
          {/* Background with enhanced glass effect */}
          <div className={cn(
            "absolute inset-0 rounded-3xl transition-all duration-500 ease-out",
            "backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/10",
            "border border-white/20 shadow-2xl shadow-black/10",
            "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-50"
          )} />
          
          {/* Animated border glow */}
          <div className={cn(
            "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500",
            isExpanded && "opacity-100",
            "bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-sm -z-10"
          )} />

          {/* Content */}
          <div className="relative w-full p-4">
            {/* Header when expanded */}
            {isExpanded && (
              <div className="mb-4 opacity-0 animate-in slide-in-from-top-2 duration-300 delay-150 fill-mode-both">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span>Navigation</span>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const isHovered = hoveredItem === item.href

                return (
                  <div 
                    key={item.href} 
                    className="relative w-full"
                    style={{
                      animationDelay: isExpanded ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center w-full rounded-2xl transition-all duration-300 relative overflow-hidden",
                            "transform hover:scale-105 active:scale-95",
                            isExpanded ? "px-4 py-3" : "px-3 py-3 justify-center",
                            isActive
                              ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                          )}
                          onMouseEnter={() => setHoveredItem(item.href)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {/* Background shimmer effect */}
                          <div className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-300",
                            isHovered && !isActive && "opacity-100",
                            "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                            "transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                          )} />

                          {/* Icon container */}
                          <div className={cn(
                            "relative flex items-center justify-center transition-all duration-300",
                            isExpanded ? "w-6 h-6" : "w-6 h-6"
                          )}>
                            <Icon
                              className={cn(
                                "transition-all duration-300",
                                isActive 
                                  ? "w-5 h-5 text-white drop-shadow-sm" 
                                  : cn("w-5 h-5", item.color, "group-hover:scale-110"),
                                isHovered && !isActive && "animate-pulse"
                              )}
                            />
                            
                            {/* Icon glow effect */}
                            {isActive && (
                              <div className={cn(
                                "absolute inset-0 rounded-full blur-md opacity-50",
                                "bg-white animate-pulse"
                              )} />
                            )}
                          </div>

                          {/* Label with enhanced animation */}
                          <div className={cn(
                            "ml-3 flex items-center justify-between flex-1 overflow-hidden transition-all duration-500",
                            isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                          )}>
                            <span className={cn(
                              "text-sm font-medium whitespace-nowrap transition-all duration-300",
                              isActive ? "text-white" : "text-foreground/90 group-hover:text-foreground",
                              isExpanded && "animate-in slide-in-from-left-2 duration-300"
                            )}>
                              {item.label}
                            </span>

                            {/* Arrow indicator */}
                            <ChevronRight className={cn(
                              "w-4 h-4 opacity-0 transition-all duration-300 transform translate-x-2",
                              isHovered && "opacity-60 translate-x-0",
                              isActive && "text-white/80"
                            )} />
                          </div>

                          {/* Notifications badge */}
                          {item.notifications > 0 && (
                            <Badge className={cn(
                              "absolute transition-all duration-300",
                              isExpanded ? "top-2 right-2" : "top-1 right-1",
                              "w-5 h-5 p-0 text-xs font-bold",
                              "bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-white/20",
                              "animate-bounce shadow-lg",
                              "hover:scale-110"
                            )}>
                              {item.notifications > 99 ? '99+' : item.notifications}
                            </Badge>
                          )}

                          {/* Ripple effect */}
                          <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 group-active:animate-ping bg-current/20" />

                          {/* Active indicator line */}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg animate-in slide-in-from-left duration-300" />
                          )}
                        </Link>
                      </TooltipTrigger>

                      {/* Tooltip only when collapsed */}
                      {!isExpanded && (
                        <TooltipContent 
                          side={position === "top-left" ? "right" : "left"}
                          className="bg-black/90 text-white border border-white/20 shadow-xl"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={cn("w-4 h-4", item.color)} />
                            <span>{item.label}</span>
                            {item.notifications > 0 && (
                              <Badge className="w-5 h-5 p-0 text-xs bg-red-500 text-white">
                                {item.notifications}
                              </Badge>
                            )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                )
              })}
            </div>

            {/* Footer when expanded */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-white/10 opacity-0 animate-in slide-in-from-bottom-2 duration-300 delay-200 fill-mode-both">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                  <span>TalentHub Pro</span>
                </div>
              </div>
            )}
          </div>

          {/* Floating particles effect */}
          {isExpanded && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-1 h-1 bg-primary rounded-full opacity-60",
                    "animate-pulse"
                  )}
                  style={{
                    left: `${20 + i * 25}%`,
                    top: `${10 + i * 30}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${2 + i * 0.5}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional CSS for enhanced animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </TooltipProvider>
  )
}