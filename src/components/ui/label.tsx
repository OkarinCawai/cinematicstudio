import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

// Needs @radix-ui/react-label but I can just make a simple span/label wrapper if I don't want the dep
// Let's just make a simple one to avoid install for now, or just use a standard label.
// But to be consistent with Shadcn patterns (which I'm mimicking), I should use a simple component.

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className
        )}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }
