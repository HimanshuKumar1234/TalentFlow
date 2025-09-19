"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface JobFiltersProps {
  filters: {
    status: string
    tags: string[]
  }
  onFiltersChange: (filters: { status: string; tags: string[] }) => void
}

const availableTags = [
  "Remote",
  "Full-time",
  "Part-time",
  "Contract",
  "Tech",
  "Startup",
  "Senior",
  "Junior",
  "Management",
]

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const updateStatus = (status: string) => {
    onFiltersChange({ ...filters, status })
  }

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
    onFiltersChange({ ...filters, tags: newTags })
  }

  const clearFilters = () => {
    onFiltersChange({ status: "all", tags: [] })
  }

  return (
    <Card className="glass-effect border-border/50 mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <div className="flex gap-2">
              {["all", "active", "archived"].map((status) => (
                <Button
                  key={status}
                  variant={filters.status === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {(filters.status !== "all" || filters.tags.length > 0) && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filters.status !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {filters.status}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateStatus("all")} />
                  </Badge>
                )}
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTag(tag)} />
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
