import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface FancyButtonProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  hideIcons?: boolean;
  [key: string]: any;
}

export default function FancyButton({ 
  leftIcon, 
  rightIcon, 
  children, 
  hideIcons = false,
  ...props 
}: FancyButtonProps) {
  return (
    <Button 
      variant="fancy" 
      className="transition-all active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(116,40,26,1)]"
      {...props}>
      {leftIcon ? leftIcon : (!hideIcons && <ArrowLeftCircle className="w-8 h-8" strokeWidth={2.5} />)}
      <span className="mx-2">{children}</span>
      {rightIcon ? rightIcon : (!hideIcons && <ArrowRightCircle className="w-8 h-8" strokeWidth={2.5} />)}
    </Button>
  );
} 