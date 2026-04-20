"use client";

import * as React from "react";
import { Play, BookOpen, Bookmark, Ellipsis } from "lucide-react";
import { RailIconButton } from "./rail-icon-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AyahMenuAction } from "./ayah-actions-mobile";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export interface AyahActionsDesktopProps {
    onPlay?: () => void;
    onTafsir?: () => void;
    onBookmark?: () => void;
    menuActions: AyahMenuAction[];
}

export function AyahActionsDesktop({
    onPlay,
    onTafsir,
    onBookmark,
    menuActions,
}: AyahActionsDesktopProps) {
    return (
        <div className="flex flex-col items-center gap-2 @max-3xl:hidden">
            <RailIconButton label="Play" onClick={onPlay}>
                <Play />
            </RailIconButton>

            <RailIconButton label="Tafsir" onClick={onTafsir}>
                <BookOpen />
            </RailIconButton>

            <RailIconButton label="Bookmark" onClick={onBookmark}>
                <Bookmark />
            </RailIconButton>

            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className="rounded-full">
                                <Ellipsis className="size-4.5" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left">More</TooltipContent>
                </Tooltip>

                <DropdownMenuContent
                    align="center"
                    side="bottom"
                    className="w-40 border rounded-sm bg-background p-0 shadow-xl"
                >
                    {menuActions.map((action) => (
                        <DropdownMenuItem
                            key={action.label}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:rounded-none"
                        >
                            <span className="shrink-0">{action.icon}</span>
                            <span>{action.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
