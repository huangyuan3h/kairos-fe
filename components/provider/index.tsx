import { ReactNode } from "react";
import { TooltipProvider } from "../ui/tooltip";

interface ProvoderProps {
  children: ReactNode;
}

export const Provider: React.FC<ProvoderProps> = ({
  children,
}: ProvoderProps) => {
  return (
    <>
      <TooltipProvider>{children}</TooltipProvider>
    </>
  );
};
