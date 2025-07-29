import * as React from "react"

const Separator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    orientation?: "horizontal" | "vertical"
    decorative?: boolean
  }
>(
  ({ className = "", orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={`shrink-0 bg-border ${
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
      } ${className}`}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

export { Separator }