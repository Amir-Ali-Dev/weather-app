import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    scrollHideDelay?: number;
    scrollbarSize?: number;
    thumbColor?: string;
    hoverable?: boolean;
  }
>(
  (
    {
      className,
      children,
      scrollHideDelay = 600,
      scrollbarSize = 10,
      thumbColor = "bg-border",
      hoverable = true,
      ...props
    },
    ref
  ) => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      scrollHideDelay={scrollHideDelay}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      
      <ScrollBar 
        orientation="vertical" 
        size={scrollbarSize} 
        thumbColor={thumbColor}
        hoverable={hoverable}
      />
      <ScrollBar 
        orientation="horizontal" 
        size={scrollbarSize} 
        thumbColor={thumbColor}
        hoverable={hoverable}
      />
      
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
    size?: number;
    thumbColor?: string;
    hoverable?: boolean;
  }
>(
  (
    {
      className,
      orientation = "vertical",
      size = 10,
      thumbColor = "bg-border",
      hoverable = true,
      ...props
    },
    ref
  ) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-all duration-300",
        hoverable && "opacity-0 hover:opacity-100",
        orientation === "vertical" && `w-${size} border-l border-l-transparent p-[1px]`,
        orientation === "horizontal" && `h-${size} border-t border-t-transparent p-[1px]`,
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn(
          "relative flex-1 rounded-full transition-colors duration-200",
          thumbColor,
          hoverable && "hover:bg-primary/80"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
);
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };