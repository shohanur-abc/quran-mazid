import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";


export interface RailIconButtonProps {
    label: string;
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

export function RailIconButton({
    label,
    onClick,
    children,
    disabled,
    className,
}: RailIconButtonProps) {

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    data-state="closed"
                    aria-label={label}
                    variant='ghost'
                    type="button"
                    className={cn('rounded-full *:size-4.5!', className)}
                    onClick={onClick}
                    disabled={disabled}

                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{label}</TooltipContent>
        </Tooltip>
    );
}
