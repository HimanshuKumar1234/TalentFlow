"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, Users, ClipboardList, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/candidates", icon: Users, label: "Candidates" },
  { href: "/assessments", icon: ClipboardList, label: "Assessments" },
]

export function CircularNavbar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={cn("relative transition-all duration-300 ease-in-out", isExpanded ? "w-64 h-16" : "w-16 h-16")}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div
          className={cn(
            "absolute inset-0 glass-effect rounded-full transition-all duration-300",
            isExpanded && "rounded-2xl",
          )}
        >
          <div className="flex items-center h-full px-4">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center transition-all duration-300 hover-lift",
                    "w-12 h-12 rounded-full relative group",
                    isActive
                      ? "bg-primary text-primary-foreground animate-pulse-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/20",
                    isExpanded && index > 0 && "ml-2",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {isExpanded && (
                    <span
                      className={cn(
                        "ml-2 text-sm font-medium transition-opacity duration-300",
                        isExpanded ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap">
                        {item.label}
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
