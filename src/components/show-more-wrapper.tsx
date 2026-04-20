"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ShowMoreWrapperProps {
    children: React.ReactNode;
    initialCount?: number;
    step?: number;
    className?: string;
}

export const ShowMoreWrapper = ({ 
    children, 
    initialCount = 30, 
    step = 30, 
    className 
}: ShowMoreWrapperProps) => {
    const [visibleCount, setVisibleCount] = useState(initialCount);
    
    const arrayChildren = React.Children.toArray(children);
    const totalCount = arrayChildren.length;
    const visibleChildren = arrayChildren.slice(0, visibleCount);

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className={className}>
                {visibleChildren}
            </div>
            
            {visibleCount < totalCount && (
                <div className="flex justify-center pb-8">
                    <Button 
                        variant="secondary" 
                        onClick={() => setVisibleCount((prev) => Math.min(prev + step, totalCount))}
                        className="gap-2"
                    >
                        Show More
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};
