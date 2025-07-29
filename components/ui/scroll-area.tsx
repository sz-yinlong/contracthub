import * as React from "react"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`relative overflow-hidden ${className}`}
    {...props}
  >
    <div className="h-full w-full overflow-auto">
      {props.children}
    </div>
  </div>
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }