
import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    getFillColor?: (value: number) => string
    indicatorClassName?: string // Added support for indicatorClassName
  }
>(({ className, value = 0, max = 100, getFillColor, indicatorClassName, ...props }, ref) => {
  const percentage = (value / max) * 100
  
  const fillColor = getFillColor 
    ? getFillColor(percentage)
    : undefined
    
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          indicatorClassName
        )}
        style={{ 
          width: `${percentage}%`,
          backgroundColor: fillColor 
        }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
