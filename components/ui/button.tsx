import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "font-semibold border select-none relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 transition ease-in-out duration-200 dark:bg-white dark:text-black dark:not-disabled:hover:bg-gray-10 dark:focus-visible:ring-gray-a4 dark:focus-visible:bg-gray-a10 bg-black text-white not-disabled:hover:bg-black/90 focus-visible:bg-black/90 focus-visible:ring-black/20 focus-visible:ring-2 focus-visible:outline-hidden gap-1 [&_svg]:w-4 [&_svg]:h-4 pl-2.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border disabled:cursor-not-allowed disabled:opacity-70 transition-colors ease-in-out duration-200 focus-visible:ring-2 focus-visible:outline-hidden bg-gray-a2 border-gray-a3 text-gray-a9 not-disabled:hover:bg-gray-a3 focus-visible:bg-gray-a3 focus-visible:ring-gray-a3 [&_svg]:text-gray-a9 cursor-pointer",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3 rounded-xl",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-8 w-8 min-w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
