import * as React from "react";

import { cn } from "@/lib/utils";

export interface StylesInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = React.forwardRef<HTMLInputElement, StylesInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
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

StyledInput.displayName = "StyledInput";

export { StyledInput };
const styles =
  "w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2";
