import { ReactNode } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

interface ProvoderProps {
  children: ReactNode;
}

export const Provider: React.FC<ProvoderProps> = ({
  children,
}: ProvoderProps) => {
  return (
    <>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </>
  );
};
