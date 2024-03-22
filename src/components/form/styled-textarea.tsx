import * as React from "react";
import TextareaAutosize, { TextareaAutosizeProps } from "react-textarea-autosize";

import { cn } from "@/lib/utils";

const StyledTextarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextareaAutosize
        className={cn(
          "w-full border-b border-input bg-transparent pb-3.5 placeholder:text-muted-foreground focus:border-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
StyledTextarea.displayName = "Textarea";

export { StyledTextarea };

const styles =
  "w-full resize-none border-b border-stroke bg-transparent focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white";
