import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  // max-w-screen-xl
  return (
    <div className={cn("mx-auto w-full  px-2.5 md:px-0 max-w-6xl", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
