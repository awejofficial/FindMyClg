import React from 'react';
import { ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface GoToTopButtonProps {
  show: boolean;
  onClick: () => void;
}

export const GoToTopButton: React.FC<GoToTopButtonProps> = ({ show, onClick }) => {
  const isMobile = useIsMobile();

  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className={`fixed ${isMobile ? 'bottom-4 right-4 w-10 h-10' : 'bottom-6 right-6 w-12 h-12'} bg-[#F7444E] text-white rounded-full shadow-md hover:shadow-xl hover:bg-[#e63e47] transition-all duration-200 flex items-center justify-center z-20`}
    >
      <ChevronUp className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
    </button>
  );
};
